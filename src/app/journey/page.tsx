
import { prisma } from '@/lib/prisma'
import { Briefcase, Calendar, MapPin, Award } from 'lucide-react'
import { Job, Certification } from '@prisma/client'

export default async function Journey() {
    // Re-enabled CV download feature
    const jobs = await prisma.job.findMany({
        orderBy: { startDate: 'desc' },
    })

    const certs = await prisma.certification.findMany({
        orderBy: { issueDate: 'desc' },
    })

    const profile = await prisma.profile.findFirst()

    return (
        <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] max-w-5xl mx-auto pt-24">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-center md:text-left bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">My Professional Journey</h1>

                {/* CV Download Enabled */}
                {profile?.cvUrl && (
                    <a
                        href="/api/download/cv"
                        className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all text-white font-medium backdrop-blur-sm group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                        Download CV {profile.cvDisplayName ? `(${profile.cvDisplayName})` : ''}
                    </a>
                )}
            </div>

            <section className="mb-20">
                <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 border-b pb-4 border-gray-800 text-gray-100">
                    <Briefcase className="text-purple-500" />
                    Experience
                </h2>

                <div className="relative border-l-2 border-gray-800 ml-3 sm:ml-6 space-y-12">
                    {jobs.map((job: Job) => (
                        <div key={job.id} className="ml-6 sm:ml-12 relative group">
                            <span className="absolute -left-[39px] sm:-left-[59px] top-6 bg-purple-600 w-6 h-6 rounded-full border-4 border-[#05010d] shadow-sm shadow-purple-500/50 z-10"></span>

                            <div className="border border-purple-500/10 rounded-2xl p-6 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all bg-[#120822]/60 backdrop-blur-md relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                    <h3 className="text-xl font-bold tracking-wide bg-clip-text text-transparent bg-linear-to-r from-pink-400 to-purple-400">
                                        {job.position}
                                    </h3>
                                    <span className="text-xs font-mono text-gray-400 bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-full whitespace-nowrap mt-2 sm:mt-0 w-fit">
                                        {new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
                                        {job.endDate ? new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ' Present'}
                                    </span>
                                </div>

                                <div className="text-lg font-medium mb-3 flex items-center gap-2 bg-clip-text text-transparent bg-linear-to-r from-cyan-300 to-blue-400">
                                    {job.company}
                                    {job.location && <span className="text-xs text-gray-500 font-normal flex items-center ml-2 border-l border-gray-700 pl-2"><MapPin size={12} className="mr-1 text-gray-500" />{job.location}</span>}
                                </div>

                                <p className="text-gray-300 mb-4 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                                    {job.description}
                                </p>

                                {job.technologies && (
                                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-purple-500/10">
                                        {job.technologies.split(/,|;/).map((tech: string, i: number) => (
                                            <span key={i} className="px-2 py-1 text-[10px] sm:text-xs font-semibold bg-purple-900/20 text-purple-300 rounded-md border border-purple-500/20 shadow-sm hover:bg-purple-500/20 transition-colors">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 border-b pb-4 border-gray-800 text-gray-100">
                    <Award className="text-amber-500" />
                    Certifications
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certs.map((cert: Certification) => (
                        <div key={cert.id} className="p-6 rounded-xl bg-[#120822]/80 border border-purple-500/10 hover:border-purple-500/40 shadow-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all flex gap-4 items-start backdrop-blur-sm">
                            <div className="p-3 bg-amber-900/20 rounded-lg text-amber-500">
                                <Award size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1 text-gray-100">{cert.name}</h3>
                                <p className="text-sm text-gray-400 mb-2">{cert.issuer}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={14} />
                                    <span>Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="mt-20 text-center">
                <a href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white underline">Back Home</a>
            </div>
        </div>
    )
}
