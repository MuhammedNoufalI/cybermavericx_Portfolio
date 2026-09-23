// Signed admin session token: "<expiresAtMs>.<nonce>.<hmac>".
// Uses Web Crypto so it works in both middleware and Node route handlers.

export const SESSION_COOKIE = 'admin_session'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 1 week

const enc = new TextEncoder()

function getSecret(): string {
    const secret = process.env.SESSION_SECRET
    if (!secret || secret.length < 32) {
        throw new Error('SESSION_SECRET must be set (32+ chars)')
    }
    return secret
}

function b64url(buf: ArrayBuffer | Uint8Array): string {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
    let s = ''
    bytes.forEach(b => { s += String.fromCharCode(b) })
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(data: string): Promise<string> {
    const key = await crypto.subtle.importKey('raw', enc.encode(getSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
}

function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
    return diff === 0
}

export async function createSessionToken(): Promise<string> {
    const exp = Date.now() + SESSION_TTL_SECONDS * 1000
    const nonce = b64url(crypto.getRandomValues(new Uint8Array(16)))
    const payload = `${exp}.${nonce}`
    return `${payload}.${await hmac(payload)}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
    if (!token) return false
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [exp, nonce, sig] = parts
    if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false
    try {
        return safeEqual(sig, await hmac(`${exp}.${nonce}`))
    } catch (err) {
        console.error('[session]', err)
        return false
    }
}

export function safeEqualString(a: string, b: string) {
    return safeEqual(a, b)
}
