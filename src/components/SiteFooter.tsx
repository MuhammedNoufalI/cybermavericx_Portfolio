'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavLink } from '@/lib/sections'

// Footer links come from the same visible-pages list as the navbar.
export default function SiteFooter({ links, name }: { links: NavLink[], name?: string | null }) {
    const pathname = usePathname()
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return null

    return (
        <footer className="py-12 px-4 text-sm text-gray-600 flex flex-col items-center gap-3">
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                {links.filter(l => !l.external).map(l => (
                    <Link key={l.href} href={l.href} className="hover:text-gray-300">{l.label}</Link>
                ))}
                <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
            </nav>
            {name && <p>&copy; {new Date().getFullYear()} {name}. <span className="text-gray-700 mx-2">|</span> Built for the Cloud.</p>}
        </footer>
    )
}
