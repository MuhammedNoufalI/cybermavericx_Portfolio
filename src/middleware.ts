
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || ''

    // Domain-based routing: cybermavericx.com -> /blog
    if (hostname === 'cybermavericx.com' || hostname === 'www.cybermavericx.com') {
        const pathname = request.nextUrl.pathname

        // If accessing root, redirect to /blog
        if (pathname === '/') {
            return NextResponse.rewrite(new URL('/blog', request.url))
        }

        // If accessing a slug directly (e.g., cybermavericx.com/my-post)
        // Rewrite to /blog/[slug]
        if (!pathname.startsWith('/blog') && !pathname.startsWith('/_next') && !pathname.startsWith('/api') && !pathname.startsWith('/uploads')) {
            return NextResponse.rewrite(new URL(`/blog${pathname}`, request.url))
        }
    }

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const adminSession = request.cookies.get('admin_session')

        // If trying to access protected admin pages (everything except /admin login itself)
        // Note: If /admin is the login page, we allow it.
        // If /admin/dashboard etc, we check cookie.

        const isLoginPage = request.nextUrl.pathname === '/admin'

        if (!isLoginPage && !adminSession) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }

        if (isLoginPage && adminSession) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads).*)'],
}
