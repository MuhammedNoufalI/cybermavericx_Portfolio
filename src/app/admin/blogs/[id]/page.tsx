
import { prisma } from '@/lib/prisma'
import { updateBlog } from '../../actions'
import { notFound } from 'next/navigation'
import BlogContentBuilder from '@/components/BlogContentBuilder'
import DynamicList from '@/components/DynamicList'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditBlog({ params }: PageProps) {
    const { id } = await params
    const blog = await prisma.blog.findUnique({ where: { id } })

    if (!blog) notFound()

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Post</h1>

            <form action={updateBlog.bind(null, id)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input name="title" type="text" defaultValue={blog.title} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Slug</label>
                        <input name="slug" type="text" defaultValue={blog.slug} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Tags</label>
                        <input name="tags" type="text" defaultValue={blog.tags || ''} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Excerpt</label>
                    <textarea name="excerpt" defaultValue={blog.excerpt || ''} rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Content Builder</label>
                    <BlogContentBuilder name="content" initialContent={blog.content} />
                </div>

                <div>
                    <DynamicList name="references" title="References" initialData={blog.references || undefined} />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Advertising (HTML or Text)</label>
                    <textarea name="advertising" defaultValue={blog.advertising || ''} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="Ad code or promotional text..." />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <a href="/admin/blogs" className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</a>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">Update Post</button>
                </div>
            </form>
        </div>
    )
}
