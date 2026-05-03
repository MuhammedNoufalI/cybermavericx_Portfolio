
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { deleteCertification } from './actions'
import { Certification } from '@prisma/client'

export default async function AdminCerts() {
    const certs = await prisma.certification.findMany({
        orderBy: { issueDate: 'desc' },
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Certifications</h1>
                <Link href="/admin/certs/new" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <Plus size={18} />
                    Add Cert
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium text-sm">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Issuer</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {certs.map((cert: Certification) => (
                            <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    {cert.imageUrl && (
                                        <img src={cert.imageUrl} alt={cert.name} className="w-10 h-10 rounded object-cover" />
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium">{cert.name}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{cert.issuer}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(cert.issueDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link href={`/admin/certs/${cert.id}`} className="text-blue-600 hover:text-blue-800 p-1">
                                            <Pencil size={18} />
                                        </Link>
                                        <form action={deleteCertification.bind(null, cert.id)}>
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
                {certs.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No certifications found. Add one!
                    </div>
                )}
            </div>
        </div>
    )
}
