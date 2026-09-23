import { headers } from 'next/headers'
import { Trash2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { createLink, deleteLink } from './actions'
import CopyButton from './CopyButton'

export const dynamic = 'force-dynamic'

const when = (d: Date | null) => d ? d.toLocaleString('en-GB', { timeZone: process.env.NOTIFY_TIMEZONE || 'Asia/Dubai', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

export default async function LinksPage() {
    const h = await headers()
    const origin = `${h.get('x-forwarded-proto') || 'https'}://${h.get('host')}`
    const links = await prisma.trackedLink.findMany({ orderBy: { createdAt: 'desc' } })

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tracked Links</h1>
            <p className="text-gray-600 text-sm mb-6">
                Create a personal link for each recruiter or company you contact. When they open it you get a Telegram alert,
                and any CV download from that visit names the link. Visitors see a normal page, with nothing to fill in.
            </p>

            <form action={createLink} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm mb-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input name="label" required maxLength={150} placeholder="Who is it for? e.g. ENBD – Sara (HR)" className="px-4 py-2 rounded-lg border border-gray-300" />
                <input name="note" maxLength={2000} placeholder="Note (optional): role, where you applied" className="px-4 py-2 rounded-lg border border-gray-300" />
                <button className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">Create link</button>
            </form>

            {links.length === 0 ? (
                <div className="p-10 text-center text-gray-500 bg-white rounded-xl border border-gray-200">No tracked links yet.</div>
            ) : (
                <div className="space-y-3">
                    {links.map(l => {
                        const url = `${origin}/?r=${l.code}`
                        return (
                            <div key={l.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold">{l.label}</p>
                                        {l.note && <p className="text-sm text-gray-500">{l.note}</p>}
                                    </div>
                                    <form action={deleteLink.bind(null, l.id)}>
                                        <button title="Delete" className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                                    </form>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <code className="flex-1 min-w-0 truncate text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1.5">{url}</code>
                                    <CopyButton text={url} />
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-gray-600">
                                    <span>👀 Opened <b>{l.visits}</b></span>
                                    <span>📥 CV downloads <b>{l.downloads}</b></span>
                                    <span>Last activity {when(l.lastSeenAt)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
