
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSessionToken, safeEqualString, SESSION_COOKIE, SESSION_TTL_SECONDS } from '@/lib/session'

export async function POST(request: Request) {
    const { username, password } = await request.json().catch(() => ({}))

    // No fallback credentials: refuse to log anyone in until .env is configured
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
        console.error('[auth] ADMIN_USERNAME / ADMIN_PASSWORD / SESSION_SECRET not configured')
        return NextResponse.json({ success: false, message: 'Login is not configured' }, { status: 500 })
    }

    const userOk = safeEqualString(String(username ?? ''), ADMIN_USERNAME)
    const passOk = safeEqualString(String(password ?? ''), ADMIN_PASSWORD)

    if (userOk && passOk) {
        const cookieStore = await cookies()
        cookieStore.set(SESSION_COOKIE, await createSessionToken(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: SESSION_TTL_SECONDS,
            path: '/',
        })
        return NextResponse.json({ success: true })
    }

    // Slow down brute force a little
    await new Promise(r => setTimeout(r, 750))
    return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 })
}
