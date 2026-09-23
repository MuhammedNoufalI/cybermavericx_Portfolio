import { notFound } from 'next/navigation'
import { getCollection } from '../../collections'
import { createItem } from '../../actions'
import ItemForm from '../../ItemForm'

export default async function NewItem({ params }: { params: Promise<{ collection: string }> }) {
    const { collection: slug } = await params
    const c = getCollection(slug)
    if (!c) notFound()

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Add {c.singular}</h1>
            <ItemForm collection={c} action={createItem.bind(null, c.slug)} />
        </div>
    )
}
