
import { prisma } from '@/lib/prisma'
import ExternalPagesList from './ExternalPagesList'

export const dynamic = 'force-dynamic'

export default async function ExternalPagesAdmin() {
    const pages = await prisma.externalPage.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 pt-24 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">External Pages</h1>
                    <a href="/admin/dashboard" className="text-blue-500 hover:underline">Back to Dashboard</a>
                </div>

                <ExternalPagesList initialPages={pages} />
            </div>
        </div>
    )
}
