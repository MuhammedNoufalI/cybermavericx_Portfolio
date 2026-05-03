
import { prisma } from '@/lib/prisma'
import { updateCertification } from '../actions'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditCertification({ params }: PageProps) {
    const { id } = await params
    const cert = await prisma.certification.findUnique({ where: { id } })

    if (!cert) notFound()

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Certification</h1>

            <form action={updateCertification.bind(null, id)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div>
                    <label className="block text-sm font-medium mb-2">Certification Name</label>
                    <input name="name" type="text" defaultValue={cert.name} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Issuer</label>
                    <input name="issuer" type="text" defaultValue={cert.issuer} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Date Issued</label>
                    <input name="issueDate" type="date" defaultValue={cert.issueDate.toISOString().split('T')[0]} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Credential URL</label>
                    <input name="credentialUrl" type="url" defaultValue={cert.credentialUrl || ''} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Badge Image</label>
                    <div className="flex gap-4 items-center mb-2">
                        {cert.imageUrl && (
                            <img src={cert.imageUrl} alt="Current" className="w-12 h-12 rounded object-cover border border-gray-300 dark:border-gray-600" />
                        )}
                        <input name="image" type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <a href="/admin/certs" className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</a>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors">Update Certification</button>
                </div>
            </form>
        </div>
    )
}
