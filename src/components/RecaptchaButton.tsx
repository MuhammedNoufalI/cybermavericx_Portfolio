'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RECAPTCHA_SITE_KEY } from '@/lib/recaptcha-config'
import { loadRecaptcha, badgeMounted } from '@/lib/recaptcha-client'

type Props = {
    action: string
    // Called with a fresh token for this attempt. Must resolve when the attempt is finished
    // (success or failure) — the widget is reset afterwards so the next click mints a new token.
    onToken: (token: string | null) => Promise<void>
    // Optional pre-check (e.g. form validation). Return false to abort without submitting.
    beforeSubmit?: () => boolean
    className?: string
    children: React.ReactNode
    busyLabel?: React.ReactNode
    // Rendered directly under the button (e.g. the CV filename)
    below?: React.ReactNode
}

// Policy-based key: the widget is bound to the submit button itself, so Google
// can show a challenge when the interaction looks risky.
export default function RecaptchaButton({ action, onToken, beforeSubmit, className, children, busyLabel, below }: Props) {
    const btnRef = useRef<HTMLButtonElement>(null)
    const widgetId = useRef<number | null>(null)
    const inFlight = useRef(false)
    const mounting = useRef(false)
    const started = useRef(false)
    const readyRef = useRef(!RECAPTCHA_SITE_KEY)
    const [busy, setBusy] = useState(false)
    const [ready, setReady] = useState(!RECAPTCHA_SITE_KEY)
    const [notice, setNotice] = useState('')
    const onTokenRef = useRef(onToken)
    const beforeRef = useRef(beforeSubmit)
    onTokenRef.current = onToken
    beforeRef.current = beforeSubmit

    const reset = useCallback(() => {
        inFlight.current = false
        setBusy(false)
        if (widgetId.current !== null) {
            try { window.grecaptcha?.enterprise.reset(widgetId.current) } catch { /* ignore */ }
        }
    }, [])

    const run = useCallback(async (token: string | null) => {
        if (inFlight.current) return // double-click guard
        inFlight.current = true
        setBusy(true)
        setNotice('')
        try {
            if (beforeRef.current && !beforeRef.current()) return
            await onTokenRef.current(token)
        } finally {
            reset()
        }
    }, [reset])

    const mount = useCallback(async () => {
        if (!RECAPTCHA_SITE_KEY || !btnRef.current || widgetId.current !== null || mounting.current) return
        mounting.current = true
        try {
            await loadRecaptcha()
            await new Promise<void>(r => window.grecaptcha!.enterprise.ready(r))
            widgetId.current = window.grecaptcha!.enterprise.render(btnRef.current, {
                sitekey: RECAPTCHA_SITE_KEY,
                action,
                callback: (token) => { void run(token) },
                'expired-callback': () => { setNotice('Verification expired. Please try again.'); reset() },
                'error-callback': () => { setNotice('Verification could not load. Check your connection or ad blocker, then try again.'); reset() },
            })
            readyRef.current = true
            setReady(true)
            setNotice('')
        } catch {
            setNotice('Verification could not load. Check your connection or ad blocker, then retry.')
        } finally {
            mounting.current = false
        }
    }, [action, reset, run])

    // Lazy start: Google's widget costs ~200–900 ms of main-thread time per page view, so it is
    // rendered only on intent (hover / focus / touch) or once the button is on screen and the
    // browser is idle — never during navigation.
    const start = useCallback(() => {
        if (started.current) return
        started.current = true
        void mount()
    }, [mount])

    useEffect(() => {
        if (!RECAPTCHA_SITE_KEY || !btnRef.current) return
        badgeMounted(1)
        let idleId: number | undefined
        const io = new IntersectionObserver(entries => {
            if (!entries.some(e => e.isIntersecting)) return
            io.disconnect()
            const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500))
            idleId = ric(start, { timeout: 3000 })
        })
        io.observe(btnRef.current)
        return () => {
            io.disconnect()
            if (idleId !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idleId)
            badgeMounted(-1)
        }
    }, [start])

    const onClick = () => {
        // No site key (local dev): plain button, server skips verification outside production.
        if (!RECAPTCHA_SITE_KEY) { void run(null); return }
        // Tapped before the widget finished loading: start it now; once rendered, the widget owns clicks.
        if (!readyRef.current) { start(); setNotice('One moment… preparing secure verification, then tap again.') }
    }

    return (
        <div className="w-full flex flex-col items-center" onPointerEnter={start} onFocusCapture={start} onTouchStartCapture={start}>
            <button
                ref={btnRef}
                type="button"
                onClick={onClick}
                disabled={busy}
                aria-disabled={busy || !ready}
                className={className}
            >
                {busy && busyLabel ? busyLabel : children}
            </button>
            {below}
            {notice && (
                <p className="text-amber-400 text-xs mt-2 text-center">
                    {notice}{' '}
                    {!ready && <button type="button" className="underline" onClick={() => void mount()}>Retry</button>}
                </p>
            )}
            {RECAPTCHA_SITE_KEY && (
                // The badge is hidden on this page (visibility only), so Google's attribution is
                // required here instead — visible without interaction, next to the button.
                <p className="mt-3 max-w-xs text-center text-[11px] leading-snug text-gray-500">
                    This site is protected by reCAPTCHA and the Google{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">Privacy Policy</a> and{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">Terms of Service</a> apply.
                </p>
            )}
        </div>
    )
}
