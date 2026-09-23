
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification } from '@/lib/telegram'
import { verifyRecaptcha } from '@/lib/recaptcha'
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

        const check = await verifyRecaptcha(body?.token, 'cv_download', meta)
        if (!check.ok) {
            console.warn('[CV] Blocked download:', check.reason, meta.ip, meta.userAgent)
            return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 403 })
        }

        const profile = await prisma.profile.findFirst({
            select: { cvUrl: true, cvDisplayName: true }
        })
        const filepath = profile?.cvUrl ? resolveStoredFile(profile.cvUrl) : null
        if (!filepath) {
            return NextResponse.json({ error: 'CV not found' }, { status: 404 })
        }

        const fileBuffer = await readFile(filepath)

        // Only verified humans reach this point
        const message = `📥 *CV Downloaded*\n\n*Time:* ${new Date().toLocaleString()}\n*IP:* ${meta.ip}${meta.country ? ` (${meta.country})` : ''}\n*Score:* ${check.score ?? 'n/a'}\n*User Agent:* ${meta.userAgent}`
        sendTelegramNotification(message).catch(err => console.error('CV Notification Error:', err))

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
