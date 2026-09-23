// Real client IP behind Cloudflare. X-Forwarded-For is client-controlled
// (bots were sending "127.0.0.1,..."), so prefer CF-Connecting-IP.
export function clientIp(headers: Headers): string {
    return headers.get('cf-connecting-ip')
        || headers.get('x-real-ip')
        || headers.get('x-forwarded-for')?.split(',').pop()?.trim()
        || 'unknown'
}

export function clientMeta(headers: Headers) {
    return {
        ip: clientIp(headers),
        userAgent: headers.get('user-agent') || 'unknown',
        country: headers.get('cf-ipcountry') || undefined,
    }
}
