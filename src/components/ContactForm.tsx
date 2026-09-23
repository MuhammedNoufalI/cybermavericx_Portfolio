'use client'

import { useActionState, useRef } from 'react'
import { submitMessage, type ContactState } from '@/app/contact/actions'
import { getRecaptchaToken, preloadRecaptcha } from '@/lib/recaptcha-client'

const input = 'w-full px-4 py-3 rounded-lg bg-[#0d1117]/50 border border-gray-700 text-gray-100 focus:border-purple-500 focus:bg-[#0d1117] focus:ring-1 focus:ring-purple-500 outline-none transition-colors'

export default function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [state, formAction, pending] = useActionState(async (prev: ContactState, formData: FormData) => {
        try {
            const token = await getRecaptchaToken('contact')
            if (token) formData.set('recaptchaToken', token)
        } catch {
            return { ok: false, error: 'Could not load verification. Please retry.' }
        }
        const result = await submitMessage(prev, formData)
        if (result?.ok) formRef.current?.reset()
        return result
    }, null)

    return (
        <form ref={formRef} action={formAction} onFocus={preloadRecaptcha} className="bg-[#120822]/60 backdrop-blur-md p-8 rounded-2xl border border-purple-500/10 shadow-lg shadow-purple-500/5 space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input name="name" type="text" id="name" required maxLength={200} className={input} placeholder="John Doe" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input name="email" type="email" id="email" required maxLength={200} className={input} placeholder="john@example.com" />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea name="message" id="message" rows={4} required maxLength={5000} className={input} placeholder="Hello..." />
            </div>
            {state?.ok && <p className="text-green-400 text-sm">Thanks! Your message has been sent.</p>}
            {state && !state.ok && <p className="text-red-400 text-sm">{state.error}</p>}
            <button type="submit" disabled={pending} className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-500/25 hover:scale-[1.02]">
                {pending ? 'Sending...' : 'Send Message'}
            </button>
            <p className="text-[11px] text-gray-500 text-center">
                Protected by reCAPTCHA — Google <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">Privacy</a> &amp; <a href="https://policies.google.com/terms" className="underline" target="_blank" rel="noopener noreferrer">Terms</a> apply.
            </p>
        </form>
    )
}
