
import { createBlog } from '../../actions'
import BlogContentBuilder from '@/components/BlogContentBuilder'
import DynamicList from '@/components/DynamicList'

export default function NewBlog() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Write New Post</h1>

            <form action={createBlog} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input name="title" type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="My Awesome Post" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Slug</label>
                        <input name="slug" type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="my-awesome-post" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                        <input name="tags" type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="Cloud, DevOps" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Excerpt</label>
                    <textarea name="excerpt" rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="Brief summary..." />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Content Builder</label>
                    <BlogContentBuilder name="content" />
                </div>

                <div>
                    <DynamicList name="references" title="References" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Advertising (HTML or Text)</label>
                    <textarea name="advertising" rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="Ad code or promotional text..." />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <a href="/admin/blogs" className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</a>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors">Publish Post</button>
                </div>
            </form>
        </div>
    )
}
