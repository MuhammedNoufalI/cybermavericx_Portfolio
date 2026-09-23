import { prisma } from '@/lib/prisma'

// DB-backed limiter that runs in front of the (billable) reCAPTCHA assessment.
// Defaults per SOP: 5/minute and 30/hour per IP, per scope.
const PER_MINUTE = Number(process.env.RATE_LIMIT_PER_MINUTE ?? '5')
const PER_HOUR = Number(process.env.RATE_LIMIT_PER_HOUR ?? '30')

export async function rateLimit(scope: string, ip: string): Promise<{ ok: boolean }> {
    const bucket = `${scope}:${ip}`.slice(0, 191)
    const now = Date.now()
    const [lastMinute, lastHour] = await Promise.all([
        prisma.rateLimitHit.count({ where: { bucket, createdAt: { gte: new Date(now - 60_000) } } }),
        prisma.rateLimitHit.count({ where: { bucket, createdAt: { gte: new Date(now - 3_600_000) } } }),
    ])
    if (lastMinute >= PER_MINUTE || lastHour >= PER_HOUR) {
        console.warn(JSON.stringify({ tag: 'rate-limit', scope, ip, lastMinute, lastHour }))
        return { ok: false }
    }
    await prisma.rateLimitHit.create({ data: { bucket } })

    // Opportunistic cleanup of rows older than the widest window
    if (Math.random() < 0.02) {
        prisma.rateLimitHit.deleteMany({ where: { createdAt: { lt: new Date(now - 3_600_000) } } }).catch(() => {})
    }
    return { ok: true }
}
