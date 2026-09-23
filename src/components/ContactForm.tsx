'use client'

import { useRef, useState } from 'react'
import { submitMessage, type ContactState } from '@/app/contact/actions'
import RecaptchaButton from './RecaptchaButton'
import { RECAPTCHA_ACTIONS } from '@/lib/recaptcha-config'

const input = 'w-full px-4 py-3 rounded-lg bg-[#0d1117]/50 border border-gray-700 text-gray-100 focus:border-purple-500 focus:bg-[#0d1117] focus:ring-1 focus:ring-purple-500 outline-none transition-colors'

export default function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [state, setState] = useState<ContactState>(null)

    const submit = async (token: string | null) => {
        const form = formRef.current!
        const formData = new FormData(form)
        if (token) formData.set('recaptchaToken', token)
        try {
            const result = await submitMessage(null, formData)
            setState(result)
            if (result?.ok) form.reset()
        } catch {
            setState({ ok: false, error: 'Something went wrong. Please try again.' })
        }
    }

    return (
        <form ref={formRef} onSubmit={e => e.preventDefault()} noValidate={false} className="bg-[#120822]/60 backdrop-blur-md p-5 sm:p-8 rounded-2xl border border-purple-500/10 shadow-lg shadow-purple-500/5 space-y-6">
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

            {/* Honeypot: invisible to people, bots fill it. Filled => fake success, nothing processed. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            {state?.ok && <p className="text-green-400 text-sm">Thanks! Your message has been sent.</p>}
            {state && !state.ok && <p className="text-red-400 text-sm">{state.error}</p>}

            <RecaptchaButton
                action={RECAPTCHA_ACTIONS.contact}
                onToken={submit}
                beforeSubmit={() => formRef.current!.reportValidity()}
                busyLabel="Sending..."
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-500/25 hover:scale-[1.02]"
            >
                Send Message
            </RecaptchaButton>
        </form>
    )
}
