import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

// The preview embeds the real public page, so it uses the exact same
// visibility rules as production — it cannot drift from what visitors see.
export default function PreviewPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-6rem)]">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Preview</h1>
                <div className="flex gap-3">
                    <Link href="/admin/sections" className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Section settings</Link>
                    <a href="/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm flex items-center gap-2 hover:bg-gray-700">
                        Open site <ExternalLink size={14} />
                    </a>
                </div>
            </div>
            <iframe src="/" title="Site preview" className="flex-1 w-full rounded-xl border border-gray-300 bg-black" />
        </div>
    )
}
