import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise'
import { RECAPTCHA_SITE_KEY } from '@/lib/recaptcha-config'

// Server-side verification via the Assessment API (policy-based key, service account).
// Env: RECAPTCHA_PROJECT_ID, RECAPTCHA_CREDENTIALS_PATH (JSON outside the web root),
//      NEXT_PUBLIC_RECAPTCHA_SITE_KEY, RECAPTCHA_ALLOWED_HOSTNAMES, RECAPTCHA_MIN_SCORE.
// Fail closed: any error, timeout or unexpected response rejects.

export type RecaptchaResult = { ok: true; score: number | null } | { ok: false; reason: string }

const TIMEOUT_MS = 3000

function configured() {
    return !!(RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_PROJECT_ID && process.env.RECAPTCHA_CREDENTIALS_PATH)
}

// One client per process
let client: RecaptchaEnterpriseServiceClient | null = null
function getClient() {
    if (!client) client = new RecaptchaEnterpriseServiceClient({ keyFilename: process.env.RECAPTCHA_CREDENTIALS_PATH })
    return client
}

// Accept each configured domain, its www. form, and any subdomain of it.
function hostnameAllowed(hostname: string | null | undefined): boolean {
    const allowed = (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || '').split(',').map(h => h.trim().toLowerCase()).filter(Boolean)
    if (!hostname || allowed.length === 0) return false
    const h = hostname.toLowerCase()
    return allowed.some(d => h === d || h.endsWith(`.${d}`))
}

export function log(entry: Record<string, unknown>) {
    console.log(JSON.stringify({ tag: 'recaptcha', ...entry }))
}

export async function verifyRecaptcha(token: string | null | undefined, expectedAction: string, meta: { ip?: string; userAgent?: string } = {}): Promise<RecaptchaResult> {
    // Local dev without keys only. Production with no config fails closed below.
    if (!configured() && process.env.NODE_ENV !== 'production') {
        log({ action: expectedAction, outcome: 'dev-bypass', reason: 'not-configured' })
        return { ok: true, score: null }
    }

    // 1. Missing token — reject before any (billable) API call
    if (!token || typeof token !== 'string' || token.length > 10_000) {
        log({ action: expectedAction, outcome: 'reject', reason: 'missing-token', ip: meta.ip })
        return { ok: false, reason: 'missing-token' }
    }

    if (!configured()) {
        log({ action: expectedAction, outcome: 'reject', reason: 'not-configured' })
        return { ok: false, reason: 'not-configured' }
    }

    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5')

    try {
        const c = getClient()
        const call = c.createAssessment({
            parent: c.projectPath(process.env.RECAPTCHA_PROJECT_ID!),
            assessment: {
                event: {
                    token,
                    siteKey: RECAPTCHA_SITE_KEY,
                    expectedAction,
                    ...(meta.ip && meta.ip !== 'unknown' && { userIpAddress: meta.ip }),
                    ...(meta.userAgent && { userAgent: meta.userAgent }),
                },
            },
        }, { timeout: TIMEOUT_MS, maxRetries: 0 })
        const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS + 250))
        const [response] = await Promise.race([call, timeout])

        const props = response.tokenProperties
        const score = typeof response.riskAnalysis?.score === 'number' ? response.riskAnalysis.score : null
        const reasons = (response.riskAnalysis?.reasons || []).map(String)
        const base = { action: expectedAction, gotAction: props?.action, hostname: props?.hostname, score, reasons, ip: meta.ip }

        // 2. Token valid
        if (!props?.valid) {
            log({ ...base, outcome: 'reject', reason: `invalid:${props?.invalidReason}` })
            return { ok: false, reason: 'invalid-token' }
        }
        // 3. Action matches
        if (props.action !== expectedAction) {
            log({ ...base, outcome: 'reject', reason: 'action-mismatch' })
            return { ok: false, reason: 'action-mismatch' }
        }
        // 4. Hostname is ours
        if (!hostnameAllowed(props.hostname)) {
            log({ ...base, outcome: 'reject', reason: 'hostname' })
            return { ok: false, reason: 'hostname' }
        }
        // 5. Score threshold
        if (score === null || score < minScore) {
            log({ ...base, outcome: 'reject', reason: 'low-score', minScore })
            return { ok: false, reason: 'low-score' }
        }

        log({ ...base, outcome: 'pass' })
        return { ok: true, score }
    } catch (err) {
        // Fail closed
        log({ action: expectedAction, outcome: 'reject', reason: 'api-error', error: err instanceof Error ? err.message : String(err), ip: meta.ip })
        return { ok: false, reason: 'api-error' }
    }
}
