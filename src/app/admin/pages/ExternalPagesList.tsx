'use client'

import { createExternalPage, deleteExternalPage } from '@/app/admin/actions'
import { Plus, Trash2, Globe, ExternalLink } from 'lucide-react'
import { useRef } from 'react'
import { useFormStatus } from 'react-dom'

// Note: To make standard forms work with list updates without full reload, 
// we rely on revalidatePath in the action.

export default function ExternalPagesList({ initialPages }: { initialPages: any[] }) {
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <>
            {/* Create Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-blue-500" />
                    Add New Website
                </h2>
                <form
                    action={async (formData) => {
                        await createExternalPage(formData)
                        formRef.current?.reset()
                    }}
                    ref={formRef}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <input
                        name="title"
                        placeholder="Page Title (e.g. My Old Portfolio)"
                        required
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <input
                        name="url"
                        placeholder="https://example.com"
                        type="url"
                        required
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <SubmitButton />
                </form>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {initialPages.map(page => (
                    <div key={page.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{page.title}</h3>
                                <a href={page.url} target="_blank" className="text-sm text-gray-500 hover:text-blue-400 flex items-center gap-1">
                                    {page.url} <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>

                        <form action={deleteExternalPage.bind(null, page.id)}>
                            <DeleteButton />
                        </form>
                    </div>
                ))}

                {initialPages.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No external pages added yet.
                    </div>
                )}
            </div>
        </>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
            {pending ? 'Adding...' : 'Add Page'}
        </button>
    )
}

function DeleteButton() {
    const { pending } = useFormStatus()
    return (
        <button
            disabled={pending}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
        >
            <Trash2 size={20} />
        </button>
    )
}
