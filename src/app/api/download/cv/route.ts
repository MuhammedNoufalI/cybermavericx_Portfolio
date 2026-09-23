
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification } from '@/lib/telegram'
import { verifyRecaptcha, log as logRecaptcha } from '@/lib/recaptcha'
import { RECAPTCHA_ACTIONS, RECAPTCHA_GENERIC_ERROR } from '@/lib/recaptcha-config'
import { rateLimit } from '@/lib/rate-limit'
import { describeDevice, formatTime, getAttribution, lookupIp, md } from '@/lib/visitor'
import { clientMeta } from '@/lib/request-meta'
import { resolveStoredFile } from '@/lib/upload'
import { readFile } from 'fs/promises'
import { NextResponse } from 'next/server'

// GET used to serve the CV directly, so crawlers/curl hit it daily.
// Downloads now require a POST with a valid reCAPTCHA Enterprise token.
export async function GET() {
    return new NextResponse('Method Not Allowed', { status: 405, headers: { Allow: 'POST', 'X-Robots-Tag': 'noindex' } })
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}))
        const meta = clientMeta(request.headers)

        const token = typeof body?.token === 'string' ? body.token : null

        // Free checks before the billable assessment: token present, then rate limit
        if (!token && process.env.NODE_ENV === 'production') {
            logRecaptcha({ action: RECAPTCHA_ACTIONS.cvDownload, outcome: 'reject', reason: 'missing-token', ip: meta.ip })
            return NextResponse.json({ error: RECAPTCHA_GENERIC_ERROR }, { status: 403 })
        }
        if (!(await rateLimit('cv', meta.ip)).ok) {
            return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes and try again.' }, { status: 429 })
        }

        const check = await verifyRecaptcha(token, RECAPTCHA_ACTIONS.cvDownload, meta)
        if (!check.ok) {
            return NextResponse.json({ error: RECAPTCHA_GENERIC_ERROR }, { status: 403 })
        }

        const profile = await prisma.profile.findFirst({
            select: { cvUrl: true, cvDisplayName: true }
        })
        const filepath = profile?.cvUrl ? resolveStoredFile(profile.cvUrl) : null
        if (!filepath) {
            return NextResponse.json({ error: 'CV not found' }, { status: 404 })
        }

        const fileBuffer = await readFile(filepath)

        // Only verified humans reach this point. Attribution runs after the response
        // is prepared so a slow IP lookup never delays the download.
        const { link, source } = await getAttribution()
        const headers = request.headers
        const notify = async () => {
            const ipi = await lookupIp(meta.ip, headers)
            const device = describeDevice(meta.userAgent)
            await prisma.cvDownload.create({
                data: {
                    ip: meta.ip, country: ipi.country ?? null, city: ipi.city ?? null, org: ipi.org ?? null,
                    source, linkId: link?.id ?? null, linkLabel: link?.label ?? null,
                    device, userAgent: meta.userAgent, score: check.score,
                },
            })
            if (link) await prisma.trackedLink.update({ where: { id: link.id }, data: { downloads: { increment: 1 }, lastSeenAt: new Date() } })

            const place = [ipi.city, ipi.country].filter(Boolean).join(', ')
            const text = [
                `📥 *CV Downloaded*`,
                ``,
                link ? `🔗 *Link:* ${md(link.label)}` : `🔗 *Link:* none (organic visit)`,
                ipi.org && `🏢 *Network:* ${md(ipi.org)}`,
                place && `📍 *Location:* ${md(place)}`,
                source && source !== 'direct' && `↪️ *Came from:* ${md(source)}`,
                `💻 *Device:* ${md(device)}`,
                `🛡 *Human score:* ${check.score ?? 'n/a'}`,
                `🕒 ${formatTime()}`,
                `🌐 ${meta.ip}`,
            ].filter(Boolean).join('\n')
            await sendTelegramNotification(text)
        }
        notify().catch(err => console.error('CV Notification Error:', err))

        const downloadName = (profile!.cvDisplayName || 'CV.pdf').replace(/["\r\n]/g, '')

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${downloadName}"`,
                'Cache-Control': 'no-store',
                'X-Robots-Tag': 'noindex',
            },
        })

    } catch (error) {
        console.error('Download Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
