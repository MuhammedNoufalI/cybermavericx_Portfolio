// Server-side reCAPTCHA Enterprise verification (score-based key).
// Env: NEXT_PUBLIC_RECAPTCHA_SITE_KEY, RECAPTCHA_PROJECT_ID, RECAPTCHA_API_KEY, RECAPTCHA_MIN_SCORE (default 0.5)

export type RecaptchaResult = { ok: true; score: number | null } | { ok: false; reason: string }

export function recaptchaConfigured() {
    return !!(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_PROJECT_ID && process.env.RECAPTCHA_API_KEY)
}

export async function verifyRecaptcha(token: string | null | undefined, expectedAction: string, meta: { ip?: string; userAgent?: string } = {}): Promise<RecaptchaResult> {
    if (!recaptchaConfigured()) {
        // Fail closed in production; allow local dev without keys.
        if (process.env.NODE_ENV === 'production') return { ok: false, reason: 'recaptcha-not-configured' }
        console.warn('[reCAPTCHA] Not configured — skipping verification (dev only)')
        return { ok: true, score: null }
    }
    if (!token) return { ok: false, reason: 'missing-token' }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5')
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(process.env.RECAPTCHA_PROJECT_ID!)}/assessments?key=${encodeURIComponent(process.env.RECAPTCHA_API_KEY!)}`

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: {
                    token,
                    siteKey,
                    expectedAction,
                    ...(meta.ip && { userIpAddress: meta.ip }),
                    ...(meta.userAgent && { userAgent: meta.userAgent }),
                },
            }),
            cache: 'no-store',
        })
        if (!res.ok) {
            console.error('[reCAPTCHA] Assessment API error:', res.status, await res.text())
            return { ok: false, reason: 'assessment-failed' }
        }
        const data = await res.json()
        const props = data.tokenProperties || {}
        if (!props.valid) return { ok: false, reason: `invalid-token:${props.invalidReason || 'unknown'}` }
        if (props.action !== expectedAction) return { ok: false, reason: 'action-mismatch' }
        const score = typeof data.riskAnalysis?.score === 'number' ? data.riskAnalysis.score : 0
        if (score < minScore) return { ok: false, reason: `low-score:${score}` }
        return { ok: true, score }
    } catch (err) {
        console.error('[reCAPTCHA] Network error:', err)
        return { ok: false, reason: 'network-error' }
    }
}
