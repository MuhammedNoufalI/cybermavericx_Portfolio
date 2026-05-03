
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { deleteBlog } from '../actions'
import { Blog } from '@prisma/client'

export default async function AdminBlogs() {
    const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Blogs</h1>
                <Link href="/admin/blogs/new" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <Plus size={18} />
                    New Post
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium text-sm">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {blogs.map((blog: Blog) => (
                            <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 font-medium">{blog.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${blog.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {blog.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link href={`/admin/blogs/${blog.id}`} className="text-blue-600 hover:text-blue-800 p-1">
                                            <Pencil size={18} />
                                        </Link>
                                        <form action={deleteBlog.bind(null, blog.id)}>
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
                {blogs.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No blog posts found. Write one!
                    </div>
                )}
            </div>
        </div>
    )
}
