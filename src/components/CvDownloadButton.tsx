'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import RecaptchaButton from './RecaptchaButton'
import { RECAPTCHA_ACTIONS } from '@/lib/recaptcha-config'

export default function CvDownloadButton({ label }: { label: string }) {
    const [error, setError] = useState('')

    const download = async (token: string | null) => {
        setError('')
        try {
            const res = await fetch('/api/download/cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || 'Download failed. Please try again.')
            }
            const filename = /filename="([^"]+)"/.exec(res.headers.get('Content-Disposition') || '')?.[1] || 'CV.pdf'
            const url = URL.createObjectURL(await res.blob())
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            a.remove()
            setTimeout(() => URL.revokeObjectURL(url), 10_000)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Download failed. Please try again.')
        }
    }

    return (
        <div className="flex flex-col items-center">
            <RecaptchaButton
                action={RECAPTCHA_ACTIONS.cvDownload}
                onToken={download}
                busyLabel={<><Loader2 size={18} className="animate-spin" /> Preparing...</>}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all text-white font-medium backdrop-blur-sm disabled:opacity-60"
            >
                <Download size={18} /> {label}
            </RecaptchaButton>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
    )
}
