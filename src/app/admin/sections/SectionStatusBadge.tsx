import type { SectionStatus } from '@/lib/sections'

export default function SectionStatusBadge({ status }: { status: SectionStatus }) {
    const styles = {
        visible: 'bg-green-100 text-green-700',
        empty: 'bg-gray-100 text-gray-600',
        disabled: 'bg-amber-100 text-amber-700',
    }[status.reason]
    const text = {
        visible: `Visible · ${status.count} item${status.count === 1 ? '' : 's'}`,
        empty: 'Hidden · empty',
        disabled: `Hidden · disabled${status.count ? ` (${status.count} item${status.count === 1 ? '' : 's'})` : ''}`,
    }[status.reason]
    return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>{text}</span>
}
