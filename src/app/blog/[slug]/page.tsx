
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: PageProps) {
    const { slug } = await params

    const post = await prisma.blog.findUnique({
        where: { slug },
    })

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to Blog
            </Link>

            <header className="mb-10">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-linear-to-r from-cyan-200 via-blue-400 to-purple-400 drop-shadow-md">
                    {post.title}
                </h1>

                {post.tags && (
                    <div className="flex gap-2">
                        {post.tags.split(',').map((tag: string) => (
                            <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-800/50">
                                <Tag size={12} /> {tag.trim()}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {/* Blog Content */}
            <div className="space-y-8 mb-12">
                {(() => {
                    try {
                        let blocks: any[] = []
                        if (typeof post.content === 'string') {
                            // Try to parse if it looks like JSON
                            if (post.content.trim().startsWith('[') || post.content.trim().startsWith('{')) {
                                blocks = JSON.parse(post.content)
                            } else {
                                // Fallback for old markdown content
                                return (
                                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline">
                                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
                                    </div>
                                )
                            }
                        } else {
                            blocks = post.content as any
                        }

                        // Check if it really is our block format
                        if (!Array.isArray(blocks)) return <p>Invalid content format</p>

                        return blocks.map((block: any) => {
                            if (block.type === 'subheading') {
                                const level = block.level || 2
                                const neonGradient = "bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-400 to-red-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]"

                                if (level === 3) {
                                    return <h3 key={block.id} className={`text-xl font-bold mt-6 mb-3 ${neonGradient}`}>{block.content}</h3>
                                }
                                if (level === 4) {
                                    return <h4 key={block.id} className={`text-lg font-bold mt-4 mb-2 ${neonGradient}`}>{block.content}</h4>
                                }
                                return <h2 key={block.id} className={`text-2xl font-bold mt-8 mb-4 ${neonGradient}`}>{block.content}</h2>
                            }
                            if (block.type === 'paragraph') {
                                return <p key={block.id} className="text-gray-300 leading-relaxed text-lg">{block.content}</p>
                            }
                            if (block.type === 'command') {
                                return (
                                    <div key={block.id} className="my-6 bg-black/50 rounded-lg overflow-hidden border border-gray-800">
                                        <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                                            </div>
                                            <span className="text-xs text-gray-500 font-mono">Terminal</span>
                                        </div>
                                        <div className="p-4 font-mono text-sm sm:text-base text-green-400 overflow-x-auto whitespace-pre-wrap">
                                            $ {block.content}
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        })
                    } catch (e) {
                        return <p className="text-red-500">Error rendering content</p>
                    }
                })()}
            </div>

            {/* References Section */}
            {post.references && (
                <div className="mb-12 border-t border-gray-800 pt-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">#</span> References
                    </h3>
                    <ul className="space-y-2">
                        {(() => {
                            try {
                                const refs = JSON.parse(post.references)
                                return refs.map((ref: any, idx: number) => (
                                    <li key={idx} className="flex gap-2 items-start">
                                        <span className="text-gray-500 min-w-[20px]">{idx + 1}.</span>
                                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline break-all">
                                            {ref.text || ref.url}
                                        </a>
                                    </li>
                                ))
                            } catch (e) {
                                return <li>{post.references}</li>
                            }
                        })()}
                    </ul>
                </div>
            )}

            {/* Advertisement Section */}
            {post.advertising && (
                <div className="mt-12 p-6 bg-linear-to-r from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Advertisement</p>
                    <div dangerouslySetInnerHTML={{ __html: post.advertising }} />
                </div>
            )}
        </div>
    )
}
