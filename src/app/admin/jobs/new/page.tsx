
import { createJob } from '../../actions'

export default function NewJob() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Add New Job</h1>

            <form action={createJob} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <input name="company" type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Position</label>
                        <input name="position" type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Start Date</label>
                        <input name="startDate" type="date" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">End Date (Leave empty for Present)</label>
                        <input name="endDate" type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input name="location" type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea name="description" required rows={5} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Technologies (comma separated)</label>
                    <input name="technologies" type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="React, Node.js, AWS" />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <a href="/admin/jobs" className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</a>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">Save Job</button>
                </div>
            </form>
        </div>
    )
}
