
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { isAdmin } from '@/lib/auth'
import { SESSION_COOKIE } from '@/lib/session'
import AdminNav from './AdminNav'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // The login page shares this layout: show no admin chrome until signed in.
    if (!(await isAdmin())) {
        return <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)]">{children}</div>
    }

    const logout = (
        <form action={async () => {
            'use server'
            const cookieStore = await cookies()
            cookieStore.delete(SESSION_COOKIE)
            redirect('/admin')
        }}>
            <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors font-medium">
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </form>
    )

    return (
        <div className="min-h-screen md:flex bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)]">
            <AdminNav logout={logout} />
            <main className="flex-1 min-w-0 px-4 py-6 sm:p-8 md:p-12 bg-gray-50">
                {children}
            </main>
        </div>
    )
}
