'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react'

export interface ReferenceLink {
    id: string
    text: string
    url: string
}

interface DynamicListProps {
    initialData?: string | ReferenceLink[]
    name: string
    title?: string
}

export default function DynamicList({ initialData, name, title = "References" }: DynamicListProps) {
    const [items, setItems] = useState<ReferenceLink[]>([])

    useEffect(() => {
        if (!initialData) return
        try {
            if (typeof initialData === 'string') {
                const parsed = JSON.parse(initialData)
                if (Array.isArray(parsed)) setItems(parsed)
            } else {
                setItems(initialData)
            }
        } catch (e) {
            console.error("Failed to parse initial data", e)
        }
    }, [initialData])

    const addItem = () => {
        setItems([...items, { id: crypto.randomUUID(), text: '', url: '' }])
    }

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id))
    }

    const updateItem = (id: string, field: 'text' | 'url', value: string) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
    }

    return (
        <div className="space-y-3">
            <input type="hidden" name={name} value={JSON.stringify(items)} />

            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <LinkIcon size={14} /> {title}
            </label>

            <div className="grid gap-3">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Link Title (e.g. Docs)"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-sm"
                            value={item.text}
                            onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="URL (https://...)"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-sm"
                            value={item.url}
                            onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addItem}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 text-gray-500 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={16} /> Add Reference Link
            </button>
        </div>
    )
}
