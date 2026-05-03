import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'

export default async function DynamicShowcasePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const page = await prisma.externalPage.findUnique({
        where: { id }
    })

    if (!page) notFound()

    redirect(page.url)
}
