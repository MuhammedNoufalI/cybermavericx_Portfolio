
import { createCertification } from '../actions'

export default function NewCertification() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Add New Certification</h1>

            <form action={createCertification} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div>
                    <label className="block text-sm font-medium mb-2">Certification Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Issuer</label>
                    <input name="issuer" type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Date Issued</label>
                    <input name="issueDate" type="date" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Credential URL</label>
                    <input name="credentialUrl" type="url" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="https://..." />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Badge Image</label>
                    <input name="image" type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <a href="/admin/certs" className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</a>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors">Save Certification</button>
                </div>
            </form>
        </div>
    )
}
