'use client'

// Loads enterprise.js (explicit render) once, only when a protected form mounts.

type RenderOpts = {
    sitekey: string
    action: string
    callback: (token: string) => void
    'expired-callback'?: () => void
    'error-callback'?: () => void
    badge?: 'bottomright' | 'bottomleft' | 'inline'
}

declare global {
    interface Window {
        grecaptcha?: {
            enterprise: {
                ready: (cb: () => void) => void
                render: (el: HTMLElement, opts: RenderOpts) => number
                reset: (widgetId?: number) => void
            }
        }
        __recaptchaOnload?: () => void
    }
}

let loader: Promise<void> | null = null

export function loadRecaptcha(): Promise<void> {
    if (typeof window === 'undefined') return Promise.reject(new Error('ssr'))
    if (window.grecaptcha?.enterprise?.render) return Promise.resolve()
    if (loader) return loader
    loader = new Promise<void>((resolve, reject) => {
        window.__recaptchaOnload = () => resolve()
        const s = document.createElement('script')
        s.src = 'https://www.google.com/recaptcha/enterprise.js?onload=__recaptchaOnload&render=explicit'
        s.async = true
        s.defer = true
        s.onerror = () => { loader = null; s.remove(); reject(new Error('load-failed')) }
        document.head.appendChild(s)
    })
    return loader
}

// Badge visibility is scoped to pages that have a protected form mounted.
// Hidden with visibility (not display/removal) so the widget keeps working.
let mounted = 0
export function badgeMounted(delta: 1 | -1) {
    mounted = Math.max(0, mounted + delta)
    document.documentElement.classList.toggle('recaptcha-hidden', mounted === 0)
}
