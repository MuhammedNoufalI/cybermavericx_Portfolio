
import Link from 'next/link'
import { LayoutDashboard, User, Briefcase, FileText, Award, LogOut, Mail } from 'lucide-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Double check session in layout (optional since middleware handles it, but good for getting user context if needed)
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session) {
        // Middleware should catch this, but just in case
        // redirect('/admin') 
    }

    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm z-10">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-teal-500">Portfolio Admin</h2>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavLink href="/admin/profile" icon={<User size={20} />} label="Profile" />
                    <NavLink href="/admin/jobs" icon={<Briefcase size={20} />} label="Experience" />
                    <NavLink href="/admin/blogs" icon={<FileText size={20} />} label="Blog" />
                    <NavLink href="/admin/certs" icon={<Award size={20} />} label="Certifications" />
                    <NavLink href="/admin/messages" icon={<Mail size={20} />} label="Messages" />
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <form action={async () => {
                        'use server'
                        const cookieStore = await cookies()
                        cookieStore.delete('admin_session')
                        redirect('/admin')
                    }}>
                        <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors font-medium">
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Start Mobile Header (visible only on small screens) */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-50 flex justify-between items-center shadow-sm">
                <span className="font-bold text-gray-900">Portfolio Admin</span>
                {/* Mobile menu toggle would go here */}
            </div>
            {/* End Mobile Header */}

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto mt-14 md:mt-0 bg-gray-50">
                {children}
            </main>
        </div>
    )
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium">
            {icon}
            <span>{label}</span>
        </Link>
    )
}
