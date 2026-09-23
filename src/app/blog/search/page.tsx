import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import BlogListView from '../BlogListView'

export const metadata: Metadata = { robots: { index: false } }

export default async function BlogSearch({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const q = (await searchParams).q?.trim().slice(0, 100)
    if (!q) redirect('/blog')
    return <BlogListView query={q} />
}
