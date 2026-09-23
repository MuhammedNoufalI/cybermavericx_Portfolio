import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const when = (d: Date) => d.toLocaleString('en-GB', { timeZone: process.env.NOTIFY_TIMEZONE || 'Asia/Dubai', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default async function DownloadsPage() {
    const rows = await prisma.cvDownload.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })

    return (
        <div className="max-w-5xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">CV Downloads</h1>
            <p className="text-gray-600 text-sm mb-6">Verified (human) downloads only, newest first. Latest 200.</p>

            {rows.length === 0 ? (
                <div className="p-10 text-center text-gray-500 bg-white rounded-xl border border-gray-200">No downloads yet.</div>
            ) : (
                <div className="space-y-3">
                    {rows.map(r => (
                        <div key={r.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-sm">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <p className="font-semibold">{r.linkLabel ? `🔗 ${r.linkLabel}` : 'Organic visit'}</p>
                                <span className="text-gray-500 text-xs">{when(r.createdAt)}</span>
                            </div>
                            <div className="mt-2 grid gap-1 text-gray-700 sm:grid-cols-2">
                                {r.org && <span>🏢 {r.org}</span>}
                                {(r.city || r.country) && <span>📍 {[r.city, r.country].filter(Boolean).join(', ')}</span>}
                                {r.source && r.source !== 'direct' && <span>↪️ {r.source}</span>}
                                {r.device && <span>💻 {r.device}</span>}
                                <span className="text-gray-500 break-all">🌐 {r.ip}{r.score != null ? ` · score ${r.score.toFixed(1)}` : ''}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
