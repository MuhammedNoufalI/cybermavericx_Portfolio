import BlogListView from './BlogListView'

// Served from cache; regenerated on every blog/admin save (revalidatePath('/', 'layout')).
// Search lives at /blog/search so this page never has to render per request.
export const revalidate = 3600

export default function BlogPage() {
    return <BlogListView />
}
