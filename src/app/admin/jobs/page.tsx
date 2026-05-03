
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { deleteJob } from '../actions'
import { Job } from '@prisma/client'

export default async function AdminJobs() {
    const jobs = await prisma.job.findMany({
        orderBy: { startDate: 'desc' },
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Experience</h1>
                <Link href="/admin/jobs/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <Plus size={18} />
                    Add Job
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium text-sm">
                        <tr>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Position</th>
                            <th className="px-6 py-4">Dates</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {jobs.map((job: Job) => (
                            <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 font-medium">{job.company}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{job.position}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(job.startDate).toLocaleDateString()} -
                                    {job.endDate ? new Date(job.endDate).toLocaleDateString() : ' Present'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link href={`/admin/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800 p-1">
                                            <Pencil size={18} />
                                        </Link>
                                        <form action={deleteJob.bind(null, job.id)}>
                                            <button className="text-red-500 hover:text-red-700 p-1">
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {jobs.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No jobs found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
