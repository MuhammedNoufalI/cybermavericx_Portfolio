// Single definition of reCAPTCHA action names, shared by the browser (widget
// render) and the server (expected-action check). Never type them anywhere else.
// Approved convention: submit_contact | login | signup | subscribe | otp_request.
export const RECAPTCHA_ACTIONS = {
    contact: process.env.NEXT_PUBLIC_RECAPTCHA_ACTION_CONTACT || 'submit_contact',
    // Not in the approved list yet — pending central approval.
    cvDownload: process.env.NEXT_PUBLIC_RECAPTCHA_ACTION_CV || 'download_cv',
} as const

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

export const RECAPTCHA_GENERIC_ERROR = 'Verification failed. Please try again.'
