
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ logoUrl, profileName, externalPages = [] }: { logoUrl?: string | null, profileName?: string | null, externalPages?: any[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return null

    const links = [
        { href: '/', label: 'Home' },
        { href: '/journey', label: 'Journey' },
        { href: '/blog', label: 'Blog' },
        ...externalPages.map(page => ({
            href: page.url,
            label: page.title,
            external: true
        })),
        { href: '/contact', label: 'Contact' },
    ]

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center">
                        {logoUrl && (
                            <img src={logoUrl} alt="Logo" className="h-10 md:h-14 w-auto object-contain" />
                        )}
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    target={(link as any).external ? "_blank" : undefined}
                                    className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-blue-400 ${pathname === link.href ? 'text-blue-400' : 'text-gray-300'
                                        }`}
                                >
                                    {link.label}
                                    {pathname === link.href && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-lg shadow-blue-500/50" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/5">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                target={(link as any).external ? "_blank" : undefined}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
