import { notFound } from 'next/navigation'
import { getPortfolio } from '@/lib/sections'
import PortfolioSections from '@/components/PortfolioSections'

export const dynamic = 'force-dynamic'

export default async function Projects() {
    const portfolio = await getPortfolio()
    if (!portfolio.profile || !portfolio.pageVisible('projects')) notFound()

    return (
        <div className="min-h-screen px-4 sm:px-10 lg:px-20 pb-12 font-[family-name:var(--font-geist-sans)] max-w-5xl mx-auto pt-20 sm:pt-24">
            <PortfolioSections portfolio={portfolio} page="projects" />
        </div>
    )
}
