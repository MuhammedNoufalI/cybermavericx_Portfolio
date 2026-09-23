
import { prisma } from '@/lib/prisma'
import { FileText, Briefcase, Award, Mail, Download, Link2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 3600_000)
import Link from 'next/link'

export default async function AdminDashboard() {
    const weekAgo = daysAgo(7)
    const [jobCount, blogCount, certCount, unread, cvWeek, linkCount] = await Promise.all([
        prisma.job.count(),
        prisma.blog.count(),
        prisma.certification.count(),
        prisma.message.count({ where: { read: false } }),
        prisma.cvDownload.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.trackedLink.count(),
    ])

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Total Jobs"
                    value={jobCount}
                    icon={<Briefcase size={24} className="text-blue-500" />}
                    href="/admin/jobs"
                />
                <StatCard
                    title="Blog Posts"
                    value={blogCount}
                    icon={<FileText size={24} className="text-green-500" />}
                    href="/admin/blogs"
                />
                <StatCard
                    title="Certifications"
                    value={certCount}
                    icon={<Award size={24} className="text-amber-500" />}
                    href="/admin/certs"
                />
                <StatCard
                    title="Unread Messages"
                    value={unread}
                    icon={<Mail size={24} className="text-pink-500" />}
                    href="/admin/messages"
                />
                <StatCard
                    title="CV Downloads (7 days)"
                    value={cvWeek}
                    icon={<Download size={24} className="text-cyan-500" />}
                    href="/admin/downloads"
                />
                <StatCard
                    title="Tracked Links"
                    value={linkCount}
                    icon={<Link2 size={24} className="text-purple-500" />}
                    href="/admin/links"
                />
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                <div className="flex gap-4 flex-wrap">
                    <Link href="/admin/jobs/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
                        Add New Job
                    </Link>
                    <Link href="/admin/blogs/new" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
                        Write Blog Post
                    </Link>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, href }: { title: string, value: number | string, icon: React.ReactNode, href: string }) {
    return (
        <Link href={href} className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-bold">{value}</p>
        </Link>
    )
}
