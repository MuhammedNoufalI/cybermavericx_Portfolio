import Link from 'next/link'
import { ArrowUp, ArrowDown, Eye } from 'lucide-react'
import { getPortfolio, PAGES } from '@/lib/sections'
import { setSectionPublished, moveSection } from '../content/actions'
import SectionStatusBadge from './SectionStatusBadge'

export const dynamic = 'force-dynamic'

// Where each section's content is edited
const EDIT_LINKS: Record<string, string> = {
    about: '/admin/profile',
    experience: '/admin/jobs',
    projects: '/admin/content/projects',
    skills: '/admin/content/skills',
    education: '/admin/content/education',
    certifications: '/admin/certs',
    awards: '/admin/content/awards',
    testimonials: '/admin/content/testimonials',
    custom: '/admin/content/custom',
    blog: '/admin/blogs',
}

export default async function SectionsPage() {
    const { sections, nav } = await getPortfolio()

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold">Sections</h1>
                <Link href="/admin/preview" className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <Eye size={18} /> Preview site
                </Link>
            </div>
            <p className="text-gray-600 mb-8 text-sm">
                A section appears on the website only when it is <b>Published</b> and has content. Empty or disabled sections
                are removed completely, including their spacing. A page (Journey, Projects, Blog) and its menu link exist only
                while at least one of its sections is visible.
            </p>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
                {sections.map((s, i) => (
                    <div key={s.key} className="flex items-center gap-4 px-6 py-4">
                        <div className="flex flex-col">
                            <form action={moveSection.bind(null, s.key, 'up')}>
                                <button disabled={i === 0} className="text-gray-400 hover:text-gray-800 disabled:opacity-20" title="Move up"><ArrowUp size={16} /></button>
                            </form>
                            <form action={moveSection.bind(null, s.key, 'down')}>
                                <button disabled={i === sections.length - 1} className="text-gray-400 hover:text-gray-800 disabled:opacity-20" title="Move down"><ArrowDown size={16} /></button>
                            </form>
                        </div>
                        <div className="flex-1">
                            <Link href={EDIT_LINKS[s.key]} className="font-semibold hover:text-blue-600">{s.label}</Link>
                            <span className="ml-2 text-xs text-gray-400">on {PAGES[s.page].label} page</span>
                            <div className="mt-1"><SectionStatusBadge status={s} /></div>
                        </div>
                        <form action={setSectionPublished.bind(null, s.key, !s.published)}>
                            <button className={`px-4 py-2 rounded-lg text-sm font-medium border ${s.published ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' : 'border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                                {s.published ? 'Published' : 'Disabled'}
                            </button>
                        </form>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Current website menu</h2>
                <p className="text-gray-800">{nav.map(l => l.label).join('  |  ')}</p>
            </div>
        </div>
    )
}
