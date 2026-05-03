
import { prisma } from '@/lib/prisma'
import { updateJob } from '../../actions'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditJob({ params }: PageProps) {
    const { id } = await params
    const job = await prisma.job.findUnique({ where: { id } })

    if (!job) notFound()

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Job</h1>

            <form action={updateJob.bind(null, id)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <input name="company" type="text" defaultValue={job.company} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Position</label>
                        <input name="position" type="text" defaultValue={job.position} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Start Date</label>
                        <input name="startDate" type="date" defaultValue={job.startDate.toISOString().split('T')[0]} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">End Date</label>
                        <input name="endDate" type="date" defaultValue={job.endDate?.toISOString().split('T')[0] || ''} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input name="location" type="text" defaultValue={job.location || ''} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea name="description" defaultValue={job.description} required rows={5} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Technologies (comma separated)</label>
                    <input name="technologies" type="text" defaultValue={job.technologies || ''} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <a href="/admin/jobs" className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</a>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">Update Job</button>
                </div>
            </form>
        </div>
    )
}
