'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
    LayoutDashboard, User, Briefcase, FileText, Award, Mail, Layers, Eye, FolderGit2, Wrench,
    GraduationCap, Trophy, Quote, LayoutList, Globe, Link2, Download, Menu, X,
} from 'lucide-react'

const ITEMS = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/sections', label: 'Sections', icon: Layers },
    { href: '/admin/preview', label: 'Preview', icon: Eye },
    { href: '/admin/profile', label: 'Profile / About', icon: User },
    { href: '/admin/jobs', label: 'Experience', icon: Briefcase },
    { href: '/admin/content/projects', label: 'Projects', icon: FolderGit2 },
    { href: '/admin/content/skills', label: 'Skills', icon: Wrench },
    { href: '/admin/content/education', label: 'Education', icon: GraduationCap },
    { href: '/admin/certs', label: 'Certifications', icon: Award },
    { href: '/admin/content/awards', label: 'Awards', icon: Trophy },
    { href: '/admin/content/testimonials', label: 'Testimonials', icon: Quote },
    { href: '/admin/content/custom', label: 'Custom Sections', icon: LayoutList },
    { href: '/admin/blogs', label: 'Blog', icon: FileText },
    { href: '/admin/pages', label: 'External Links', icon: Globe },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
    { href: '/admin/links', label: 'Tracked Links', icon: Link2 },
    { href: '/admin/downloads', label: 'CV Downloads', icon: Download },
]

export default function AdminNav({ logout }: { logout: React.ReactNode }) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const links = (
        <nav className="p-3 space-y-0.5">
            {ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                    <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                        <Icon size={19} />
                        <span>{label}</span>
                    </Link>
                )
            })}
        </nav>
    )

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="w-64 shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm sticky top-0 h-screen overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-teal-500">Portfolio Admin</h2>
                </div>
                <div className="flex-1">{links}</div>
                <div className="p-3 border-t border-gray-200">{logout}</div>
            </aside>

            {/* Mobile header + slide-down menu */}
            <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex justify-between items-center px-4 h-14">
                    <span className="font-bold">Portfolio Admin</span>
                    <button onClick={() => setOpen(o => !o)} className="p-2 -mr-2" aria-label="Toggle admin menu" aria-expanded={open}>
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                {open && (
                    <div className="max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-gray-100">
                        {links}
                        <div className="p-3 border-t border-gray-200">{logout}</div>
                    </div>
                )}
            </div>
        </>
    )
}
