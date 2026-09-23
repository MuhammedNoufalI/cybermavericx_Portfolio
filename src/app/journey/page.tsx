import { notFound } from 'next/navigation'
import { getPortfolio } from '@/lib/sections'
import PortfolioSections from '@/components/PortfolioSections'
import CvDownloadButton from '@/components/CvDownloadButton'

// Served from cache and regenerated when content is edited in Admin (every admin
// save calls revalidatePath('/', 'layout')). The hourly revalidate is only a safety net.
export const revalidate = 3600

// Experience, Education, Skills, Certifications, Awards + CV download.
// Only visible sections render; the page itself 404s when there is nothing to show.
export default async function Journey() {
    const portfolio = await getPortfolio()
    const { profile, pageVisible, hasCv } = portfolio
    if (!profile || !pageVisible('journey')) notFound()

    return (
        <div className="min-h-screen px-4 sm:px-10 lg:px-20 pb-12 font-[family-name:var(--font-geist-sans)] max-w-5xl mx-auto pt-20 sm:pt-24">
            <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-10 sm:mb-16">
                <h1 className="text-2xl sm:text-4xl font-bold text-center md:text-left text-balance bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
                    My Professional Journey
                </h1>
                {hasCv && (
                    <CvDownloadButton label="Download CV" caption={profile.cvDisplayName} />
                )}
            </div>

            <PortfolioSections portfolio={portfolio} page="journey" />
        </div>
    )
}
