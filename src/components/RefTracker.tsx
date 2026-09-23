'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Invisible. Remembers how the visitor arrived so a later CV download can be attributed:
//  - ?r=<code>  -> personal tracked link (pf_ref), visit reported once, param removed from the URL
//  - first-touch source (pf_src): utm_source, else the external referrer's host
const DAYS_90 = 60 * 60 * 24 * 90

function setCookie(name: string, value: string) {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${DAYS_90}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
}
const hasCookie = (name: string) => document.cookie.split('; ').some(c => c.startsWith(`${name}=`))

export default function RefTracker() {
    const pathname = usePathname()

    useEffect(() => {
        if (pathname.startsWith('/admin')) return
        try {
            const url = new URL(location.href)
            const code = url.searchParams.get('r')?.trim().slice(0, 64)
            const utm = url.searchParams.get('utm_source')?.trim().slice(0, 100)

            if (!hasCookie('pf_src')) {
                let src = utm || ''
                if (!src && document.referrer) {
                    const ref = new URL(document.referrer)
                    if (ref.host !== location.host) src = ref.host.replace(/^www\./, '')
                }
                setCookie('pf_src', src || 'direct')
            }

            if (code && /^[a-z0-9-]+$/i.test(code)) {
                setCookie('pf_ref', code)
                const body = JSON.stringify({ code, path: pathname })
                if (!navigator.sendBeacon?.('/api/track/visit', new Blob([body], { type: 'application/json' }))) {
                    fetch('/api/track/visit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
                }
                url.searchParams.delete('r')
                history.replaceState(history.state, '', url.pathname + (url.search ? url.search : '') + url.hash)
            }
        } catch { /* never break the page */ }
    }, [pathname])

    return null
}
