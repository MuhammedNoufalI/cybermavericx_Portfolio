'use client'

// Loads enterprise.js on demand and returns a token for `action`.
// Returns null when no site key is configured (local dev).

declare global {
    interface Window {
        grecaptcha?: {
            enterprise: {
                ready: (cb: () => void) => void
                execute: (siteKey: string, opts: { action: string }) => Promise<string>
            }
        }
    }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
let loader: Promise<void> | null = null

function load(): Promise<void> {
    if (loader) return loader
    loader = new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(SITE_KEY!)}`
        s.async = true
        s.onload = () => resolve()
        s.onerror = () => { loader = null; reject(new Error('Failed to load reCAPTCHA')) }
        document.head.appendChild(s)
    })
    return loader
}

export function preloadRecaptcha() {
    if (SITE_KEY) load().catch(() => {})
}

export async function getRecaptchaToken(action: string): Promise<string | null> {
    if (!SITE_KEY) return null
    await load()
    return new Promise((resolve, reject) => {
        window.grecaptcha!.enterprise.ready(() => {
            window.grecaptcha!.enterprise.execute(SITE_KEY, { action }).then(resolve, reject)
        })
    })
}
