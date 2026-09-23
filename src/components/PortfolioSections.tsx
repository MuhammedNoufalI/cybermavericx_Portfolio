import { Briefcase, MapPin, Award, Calendar, FolderGit2, GraduationCap, Trophy, Quote, Wrench, ExternalLink, Github } from 'lucide-react'
import Markdown from './Markdown'
import type { Portfolio, SectionKey, PageKey } from '@/lib/sections'

const monthYear = (d?: Date | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
const range = (start?: Date | null, end?: Date | null) => {
    if (!start && !end) return ''
    if (!start) return monthYear(end)
    return `${monthYear(start)} - ${end ? monthYear(end) : 'Present'}`
}
const splitList = (s?: string | null) => (s || '').split(/,|;/).map(t => t.trim()).filter(Boolean)

function SectionShell({ id, title, icon, children }: { id: string, title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <section id={id} className="w-full scroll-mt-24 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 flex items-center gap-3 border-b pb-4 border-gray-800 text-gray-100">
                {icon}
                {title}
            </h2>
            {children}
        </section>
    )
}

function Tags({ items }: { items: string[] }) {
    if (items.length === 0) return null
    return (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-purple-500/10">
            {items.map((tech, i) => (
                <span key={i} className="px-2 py-1 text-[10px] sm:text-xs font-semibold bg-purple-900/20 text-purple-300 rounded-md border border-purple-500/20">
                    {tech}
                </span>
            ))}
        </div>
    )
}

const card = 'border border-purple-500/10 rounded-2xl p-4 sm:p-6 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all bg-[#120822]/60 backdrop-blur-md'

// Renders only visible sections, in the admin-configured order.
// A hidden or empty section returns nothing: no wrapper, heading or spacing.
export default function PortfolioSections({ portfolio, page }: { portfolio: Portfolio, page: PageKey }) {
    const { sections, content, profile } = portfolio

    const render = (key: SectionKey): React.ReactNode => {
        switch (key) {
            case 'about':
                return (
                    <SectionShell key={key} id="about" title="About" icon={<Quote className="text-blue-400" />}>
                        <Markdown className="text-base sm:text-lg text-gray-400 markdown-bio">{profile?.bio || ''}</Markdown>
                    </SectionShell>
                )
            case 'experience':
                return (
                    <SectionShell key={key} id="experience" title="Experience" icon={<Briefcase className="text-purple-500" />}>
                        <div className="relative border-l-2 border-gray-800 ml-2 sm:ml-6 space-y-8 sm:space-y-12">
                            {content.jobs.map(job => (
                                <div key={job.id} className="ml-5 sm:ml-12 relative group">
                                    <span className="absolute -left-[31px] sm:-left-[59px] top-6 bg-purple-600 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 border-[#05010d] shadow-sm shadow-purple-500/50 z-10"></span>
                                    <div className={card}>
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                            <h3 className="text-lg sm:text-xl font-bold tracking-wide bg-clip-text text-transparent bg-linear-to-r from-pink-400 to-purple-400">{job.position}</h3>
                                            <span className="text-xs font-mono text-gray-400 bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-full whitespace-nowrap mt-2 sm:mt-0 w-fit">{range(job.startDate, job.endDate)}</span>
                                        </div>
                                        <div className="text-base sm:text-lg font-medium mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 bg-clip-text text-transparent bg-linear-to-r from-cyan-300 to-blue-400">
                                            {job.company}
                                            {job.location && <span className="text-xs text-gray-500 font-normal flex items-center sm:ml-2 sm:border-l border-gray-700 sm:pl-2"><MapPin size={12} className="mr-1" />{job.location}</span>}
                                        </div>
                                        {job.description && <Markdown className="text-gray-300 text-sm sm:text-base">{job.description}</Markdown>}
                                        <Tags items={splitList(job.technologies)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionShell>
                )
            case 'projects':
                return (
                    <SectionShell key={key} id="projects" title="Projects" icon={<FolderGit2 className="text-cyan-400" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.projects.map(p => (
                                <div key={p.id} className={`${card} flex flex-col`}>
                                    {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-full h-44 object-cover rounded-xl mb-4 border border-white/5" />}
                                    <h3 className="text-lg font-bold text-gray-100 mb-2">{p.title}</h3>
                                    {p.description && <Markdown className="text-gray-300 text-sm">{p.description}</Markdown>}
                                    <Tags items={splitList(p.technologies)} />
                                    {(p.demoUrl || p.repoUrl) && (
                                        <div className="flex gap-4 mt-4 text-sm">
                                            {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"><ExternalLink size={14} /> Live</a>}
                                            {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-300 hover:text-white"><Github size={14} /> Code</a>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SectionShell>
                )
            case 'skills': {
                const groups = new Map<string, string[]>()
                content.skills.forEach(s => {
                    const cat = s.category?.trim() || ''
                    groups.set(cat, [...(groups.get(cat) || []), s.name])
                })
                return (
                    <SectionShell key={key} id="skills" title="Skills" icon={<Wrench className="text-green-400" />}>
                        <div className="space-y-6">
                            {[...groups.entries()].map(([cat, names]) => (
                                <div key={cat || '_'}>
                                    {cat && <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">{cat}</h3>}
                                    <div className="flex flex-wrap gap-2">
                                        {names.map((n, i) => (
                                            <span key={i} className="px-3 py-1.5 text-sm bg-[#120822]/80 text-gray-200 rounded-lg border border-purple-500/20">{n}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionShell>
                )
            }
            case 'education':
                return (
                    <SectionShell key={key} id="education" title="Education" icon={<GraduationCap className="text-blue-400" />}>
                        <div className="space-y-6">
                            {content.education.map(e => (
                                <div key={e.id} className={card}>
                                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                                        <h3 className="text-lg font-bold text-gray-100">{e.degree}{e.field ? `, ${e.field}` : ''}</h3>
                                        {range(e.startDate, e.endDate) && <span className="text-xs font-mono text-gray-400 mt-2 sm:mt-0">{range(e.startDate, e.endDate)}</span>}
                                    </div>
                                    <p className="text-cyan-300">{e.institution}{e.location ? <span className="text-gray-500 text-sm"> · {e.location}</span> : null}</p>
                                    {e.description && <Markdown className="text-gray-300 text-sm mt-3">{e.description}</Markdown>}
                                </div>
                            ))}
                        </div>
                    </SectionShell>
                )
            case 'certifications':
                return (
                    <SectionShell key={key} id="certifications" title="Certifications" icon={<Award className="text-amber-500" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.certifications.map(cert => {
                                const inner = (
                                    <>
                                        {cert.imageUrl ? (
                                            <img src={cert.imageUrl} alt={cert.name} className="w-14 h-14 object-contain shrink-0" />
                                        ) : (
                                            <div className="p-3 bg-amber-900/20 rounded-lg text-amber-500 shrink-0"><Award size={24} /></div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-100 break-words">{cert.name}</h3>
                                            <p className="text-sm text-gray-400 mb-2">{cert.issuer}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar size={14} />
                                                <span>Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </>
                                )
                                const cls = 'p-4 sm:p-6 rounded-xl bg-[#120822]/80 border border-purple-500/10 hover:border-purple-500/40 transition-all flex gap-4 items-start'
                                return cert.credentialUrl
                                    ? <a key={cert.id} href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                                    : <div key={cert.id} className={cls}>{inner}</div>
                            })}
                        </div>
                    </SectionShell>
                )
            case 'awards':
                return (
                    <SectionShell key={key} id="awards" title="Awards" icon={<Trophy className="text-yellow-400" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.awards.map(a => (
                                <div key={a.id} className={card}>
                                    <h3 className="font-bold text-lg text-gray-100">
                                        {a.url ? <a href={a.url} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300">{a.title}</a> : a.title}
                                    </h3>
                                    {(a.issuer || a.date) && <p className="text-sm text-gray-400 mt-1">{[a.issuer, monthYear(a.date)].filter(Boolean).join(' · ')}</p>}
                                    {a.description && <Markdown className="text-gray-300 text-sm mt-3">{a.description}</Markdown>}
                                </div>
                            ))}
                        </div>
                    </SectionShell>
                )
            case 'testimonials':
                return (
                    <SectionShell key={key} id="testimonials" title="Testimonials" icon={<Quote className="text-pink-400" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.testimonials.map(t => (
                                <figure key={t.id} className={card}>
                                    <blockquote className="text-gray-200 italic leading-relaxed whitespace-pre-line">“{t.quote}”</blockquote>
                                    <figcaption className="flex items-center gap-3 mt-4">
                                        {t.imageUrl && <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />}
                                        <div>
                                            <p className="font-semibold text-gray-100 text-sm">{t.name}</p>
                                            {(t.role || t.company) && <p className="text-xs text-gray-500">{[t.role, t.company].filter(Boolean).join(', ')}</p>}
                                        </div>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </SectionShell>
                )
            case 'custom':
                return content.custom.map(c => (
                    <SectionShell key={c.id} id={`custom-${c.id}`} title={c.title} icon={<span className="w-2 h-6 bg-purple-500 rounded-full" />}>
                        <Markdown className="text-gray-300">{c.content}</Markdown>
                    </SectionShell>
                ))
            case 'blog':
                return null // Blog lives on /blog; it only contributes a nav link.
        }
    }

    const nodes = sections.filter(s => s.visible && s.page === page).map(s => render(s.key)).filter(Boolean)
    if (nodes.length === 0) return null

    return <div className="w-full flex flex-col gap-16 sm:gap-24">{nodes}</div>
}
