import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// Passive visitor attribution for CV downloads and contact messages.
// Nothing here asks the visitor for anything; it uses what every request already carries.

export const REF_COOKIE = 'pf_ref' // tracked-link code (set by RefTracker from ?r=)
export const SRC_COOKIE = 'pf_src' // first-touch source (referrer host / utm_source)

export type IpInfo = { org?: string; city?: string; region?: string; country?: string }

// IP -> owning organisation (company / ISP) and location, via ipapi.co (free tier, HTTPS, no key).
// Cached per process; failures are silent — attribution must never block a download.
const cache = new Map<string, { at: number; info: IpInfo }>()
const TTL = 24 * 3600_000

export async function lookupIp(ip: string, headers?: Headers): Promise<IpInfo> {
    const base: IpInfo = {
        country: headers?.get('cf-ipcountry') || undefined,
        city: headers?.get('cf-ipcity') || undefined, // present if Cloudflare "visitor location headers" is on
    }
    if (!ip || ip === 'unknown' || /^(127\.|10\.|192\.168\.|::1$)/.test(ip)) return base

    const hit = cache.get(ip)
    if (hit && Date.now() - hit.at < TTL) return { ...base, ...hit.info }

    try {
        const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
            signal: AbortSignal.timeout(2500),
            headers: { 'User-Agent': 'portfolio-cv-notify/1.0' },
            cache: 'no-store',
        })
        if (!res.ok) return base
        const d = await res.json()
        if (d.error) return base
        const info: IpInfo = {
            org: d.org || undefined,
            city: d.city || base.city,
            region: d.region || undefined,
            country: d.country_name || base.country,
        }
        cache.set(ip, { at: Date.now(), info })
        if (cache.size > 5000) cache.delete(cache.keys().next().value!)
        return { ...base, ...info }
    } catch {
        return base
    }
}

export function describeDevice(ua: string): string {
    const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows'
        : /Mac OS X|Macintosh/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown OS'
    const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome'
        : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Unknown browser'
    const mobile = /Mobile|iPhone|Android/.test(ua) ? ' (mobile)' : ''
    return `${browser} on ${os}${mobile}`
}

export async function getAttribution() {
    const jar = await cookies()
    const code = jar.get(REF_COOKIE)?.value?.slice(0, 64)
    const source = jar.get(SRC_COOKIE)?.value?.slice(0, 191)
    const link = code ? await prisma.trackedLink.findUnique({ where: { code } }) : null
    return { link, source: source || null }
}

export function formatTime(d = new Date()) {
    return d.toLocaleString('en-GB', {
        timeZone: process.env.NOTIFY_TIMEZONE || 'Asia/Dubai',
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
    })
}

// Telegram Markdown (legacy) escaping for untrusted values
export const md = (s: string | null | undefined) => (s ?? '').replace(/([_*`\[])/g, '\\$1')
