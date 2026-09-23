import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCollection } from '../../collections'
import { updateItem } from '../../actions'
import ItemForm from '../../ItemForm'

export default async function EditItem({ params }: { params: Promise<{ collection: string, id: string }> }) {
    const { collection: slug, id } = await params
    const c = getCollection(slug)
    if (!c) notFound()

    const item = await (prisma as any)[c.model].findUnique({ where: { id } })
    if (!item) notFound()

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit {c.singular}</h1>
            <ItemForm collection={c} item={item} action={updateItem.bind(null, c.slug, id)} />
        </div>
    )
}
