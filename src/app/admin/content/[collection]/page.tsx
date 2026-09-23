import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getCollection } from '../collections'
import { deleteItem } from '../actions'
import SectionStatusBadge from '@/app/admin/sections/SectionStatusBadge'
import { getPortfolio } from '@/lib/sections'

export default async function CollectionList({ params }: { params: Promise<{ collection: string }> }) {
    const { collection: slug } = await params
    const c = getCollection(slug)
    if (!c) notFound()

    const [items, portfolio] = await Promise.all([
        (prisma as any)[c.model].findMany({ orderBy: c.orderBy }) as Promise<Record<string, any>[]>,
        getPortfolio(),
    ])
    const status = portfolio.sections.find(s => s.key === c.section)!

    const cell = (v: unknown) => typeof v === 'boolean' ? (v ? 'Yes' : 'No') : (v ? String(v) : '—')

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Manage {c.title}</h1>
                <Link href={`/admin/content/${c.slug}/new`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <Plus size={18} /> Add {c.singular}
                </Link>
            </div>
            <div className="mb-8 flex items-center gap-3 text-sm text-gray-600">
                On website: <SectionStatusBadge status={status} />
                <Link href="/admin/sections" className="text-blue-600 hover:underline">Section settings</Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {items.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                            <tr>
                                {c.listColumns.map(col => <th key={col} className="px-6 py-4 capitalize">{col}</th>)}
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    {c.listColumns.map((col, i) => (
                                        <td key={col} className={`px-6 py-4 ${i === 0 ? 'font-medium' : 'text-gray-600 text-sm'}`}>{cell(item[col])}</td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/admin/content/${c.slug}/${item.id}`} className="text-blue-600 hover:text-blue-800 p-1"><Pencil size={18} /></Link>
                                            <form action={deleteItem.bind(null, c.slug, item.id)}>
                                                <button className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    // Empty states belong in the CMS, never on the public site
                    <div className="p-12 text-center text-gray-500">
                        No {c.title.toLowerCase()} yet. This section is hidden on the website until you add one.
                    </div>
                )}
            </div>
        </div>
    )
}
