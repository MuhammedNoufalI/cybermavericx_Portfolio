import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { clientMeta } from '@/lib/request-meta'
import { rateLimit } from '@/lib/rate-limit'
import { sendTelegramNotification } from '@/lib/telegram'
import { describeDevice, formatTime, lookupIp, md, SRC_COOKIE } from '@/lib/visitor'

// Someone opened one of your tracked links. Notifies once per link+IP per 30 minutes.
export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}))
    const code = typeof body?.code === 'string' ? body.code.slice(0, 64) : ''
    if (!code || !/^[a-z0-9-]+$/i.test(code)) return new NextResponse(null, { status: 204 })

    const meta = clientMeta(request.headers)
    if (!(await rateLimit('visit', meta.ip)).ok) return new NextResponse(null, { status: 204 })

    const link = await prisma.trackedLink.findUnique({ where: { code } })
    if (!link) return new NextResponse(null, { status: 204 })

    const bucket = `visitnotify:${code}:${meta.ip}`.slice(0, 191)
    const recent = await prisma.rateLimitHit.count({ where: { bucket, createdAt: { gte: new Date(Date.now() - 30 * 60_000) } } })

    await prisma.trackedLink.update({ where: { id: link.id }, data: { visits: { increment: 1 }, lastSeenAt: new Date() } })

    if (recent === 0) {
        await prisma.rateLimitHit.create({ data: { bucket } })
        const ipi = await lookupIp(meta.ip, request.headers)
        const source = (await cookies()).get(SRC_COOKIE)?.value
        const place = [ipi.city, ipi.country].filter(Boolean).join(', ')
        const text = [
            `👀 *Tracked link opened*`,
            ``,
            `🔗 *Link:* ${md(link.label)}`,
            ipi.org && `🏢 *Network:* ${md(ipi.org)}`,
            place && `📍 *Location:* ${md(place)}`,
            source && source !== 'direct' && `↪️ *Came from:* ${md(source)}`,
            `💻 *Device:* ${md(describeDevice(meta.userAgent))}`,
            `🕒 ${formatTime()}`,
            `🌐 ${meta.ip}`,
        ].filter(Boolean).join('\n')
        sendTelegramNotification(text).catch(() => {})
    }

    return new NextResponse(null, { status: 204 })
}
