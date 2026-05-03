
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, Tag, Search } from 'lucide-react'
import { Blog } from '@prisma/client'

export default async function BlogList(props: {
    searchParams: Promise<{ q?: string }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams.q

    const [posts, profile] = await Promise.all([
        prisma.blog.findMany({
            where: {
                published: true,
                ...(query ? {
                    OR: [
                        { title: { contains: query } },
                        { content: { contains: query } },
                        { excerpt: { contains: query } }
                    ]
                } : {})
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.profile.findFirst()
    ])

    const blogTitle = profile?.blogTitle || 'Blog'
    const blogHeadline = profile?.blogHeadline || ''
    const blogGradient = profile?.blogGradient || 'from-blue-400 to-purple-500'

    // Get recent 5 posts for sidebar
    const recentPosts = posts.slice(0, 5)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0118] pt-16">
            {/* Header */}
            <header className="bg-white dark:bg-[#120822] border-b border-gray-200 dark:border-gray-800 py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className={`text-3xl sm:text-5xl font-black mb-2 bg-clip-text text-transparent bg-linear-to-r ${blogGradient}`}>
                        {blogTitle}
                    </h1>
                    {blogHeadline && (
                        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                            {blogHeadline}
                        </p>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Blog Posts */}
                    <div className="lg:col-span-2 space-y-6">
                        {posts.length === 0 ? (
                            <div className="text-center text-gray-500 py-20 bg-white dark:bg-[#120822]/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-lg">No posts yet. Check back soon!</p>
                                <p className="text-sm mt-2">Admin needs to publish some content.</p>
                            </div>
                        ) : (
                            posts.map((post: Blog) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                                    <article className="bg-white dark:bg-[#120822] border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg hover:border-purple-500/30 transition-all">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            <Calendar size={14} />
                                            <time>
                                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </time>
                                        </div>

                                        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {post.title}
                                        </h2>

                                        {post.excerpt && (
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {post.tags && (
                                            <div className="flex gap-2 flex-wrap">
                                                {post.tags.split(',').map((tag: string) => (
                                                    <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">
                                                        <Tag size={10} /> {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Search Box */}
                        <div className="bg-white dark:bg-[#120822] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Search</h3>
                            <form action="/blog" method="get" className="relative">
                                <input
                                    type="text"
                                    name="q"
                                    placeholder="Search posts..."
                                    defaultValue={query}
                                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400"
                                >
                                    <Search size={18} />
                                </button>
                            </form>
                        </div>

                        {/* Recent Posts */}
                        <div className="bg-white dark:bg-[#120822] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Recent Posts</h3>
                            <div className="space-y-4">
                                {recentPosts.map((post: Blog) => (
                                    <Link
                                        key={post.id}
                                        href={`/blog/${post.slug}`}
                                        className="block group"
                                    >
                                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">
                                            {post.title}
                                        </h4>
                                        <time className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </time>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Back to Home */}
                        <div className="text-center">
                            <a
                                href="/"
                                className="inline-block text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 underline"
                            >
                                ← Back to Home
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
