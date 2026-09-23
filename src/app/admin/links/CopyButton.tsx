'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text }: { text: string }) {
    const [done, setDone] = useState(false)
    return (
        <button
            type="button"
            onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500) }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 shrink-0"
        >
            {done ? <Check size={14} className="text-green-600" /> : <Copy size={14} />} {done ? 'Copied' : 'Copy'}
        </button>
    )
}
