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
}

// Policy-based key: the widget is bound to the submit button itself, so Google
// can show a challenge when the interaction looks risky.
export default function RecaptchaButton({ action, onToken, beforeSubmit, className, children, busyLabel }: Props) {
    const btnRef = useRef<HTMLButtonElement>(null)
    const widgetId = useRef<number | null>(null)
    const inFlight = useRef(false)
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
        if (!RECAPTCHA_SITE_KEY || !btnRef.current || widgetId.current !== null) return
        try {
            await loadRecaptcha()
            await new Promise<void>(r => window.grecaptcha!.enterprise.ready(r))
            widgetId.current = window.grecaptcha!.enterprise.render(btnRef.current, {
                sitekey: RECAPTCHA_SITE_KEY,
                action,
                callback: (token) => { void run(token) },
                'expired-callback': () => { setNotice('Verification expired. Please try again.'); reset() },
                'error-callback': () => { setNotice('Verification could not load. Check your connection or ad blocker, then try again.'); reset() },
                badge: 'inline',
            })
            setReady(true)
            setNotice('')
        } catch {
            setNotice('Verification could not load. Check your connection or ad blocker, then retry.')
        }
    }, [action, reset, run])

    useEffect(() => {
        if (!RECAPTCHA_SITE_KEY) return
        badgeMounted(1)
        void mount()
        return () => badgeMounted(-1)
    }, [mount])

    // No site key (local dev): plain button, server skips verification outside production.
    const onClick = RECAPTCHA_SITE_KEY ? undefined : () => { void run(null) }

    return (
        <div className="w-full flex flex-col items-center">
            <button
                ref={btnRef}
                type="button"
                onClick={onClick}
                disabled={busy || !ready}
                className={className}
            >
                {busy && busyLabel ? busyLabel : children}
            </button>
            {notice && (
                <p className="text-amber-400 text-xs mt-2 text-center">
                    {notice}{' '}
                    {!ready && <button type="button" className="underline" onClick={() => void mount()}>Retry</button>}
                </p>
            )}
        </div>
    )
}
