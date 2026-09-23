import { redirect } from 'next/navigation'

// Experience and certifications now live on the home page as content-driven sections.
// Keep the old URL working for existing links.
export default function Journey() {
    redirect('/#experience')
}
