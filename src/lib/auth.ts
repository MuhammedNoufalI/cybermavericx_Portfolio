import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

export async function isAdmin(): Promise<boolean> {
    const cookieStore = await cookies()
    return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

// Call at the top of every admin server action. Server actions are reachable
// by POST from any page that imports them, so middleware alone is not enough.
export async function requireAdmin(): Promise<void> {
    if (!(await isAdmin())) redirect('/admin')
}
