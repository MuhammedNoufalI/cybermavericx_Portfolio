
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const { username, password } = await request.json()

    // Retrieve credentials from .env, falling back to defaults if not set
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const cookieStore = await cookies()
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 })
}
