
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'
import 'highlight.js/styles/github-dark.css'
import { getPortfolio } from '@/lib/sections'
import PortfolioSections from '@/components/PortfolioSections'
import CvDownloadButton from '@/components/CvDownloadButton'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const portfolio = await getPortfolio()
  const { profile, isVisible } = portfolio

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-blue-500 animate-pulse">Initializing System...</div>
  }

  // CTA targets follow the same visibility rules as the nav
  const journeyTarget = isVisible('experience') ? '/#experience' : isVisible('projects') ? '/#projects' : null

  return (
    <div className="min-h-screen flex flex-col items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] pt-24 overflow-hidden">
      <main className="flex flex-col gap-24 items-center text-center max-w-5xl w-full">

        {/* Hero Section */}
        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
            <div className="relative group -mb-4 sm:-mb-32 z-0 pointer-events-none select-none">
              {profile.imageUrl ? (
                <img
                  src={profile.imageUrl}
                  alt={profile.fullName}
                  className="relative w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 object-contain drop-shadow-lg sm:drop-shadow-2xl transition-all duration-300"
                  style={{
                    maskImage: 'radial-gradient(circle at center, black 50%, transparent 95%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 95%)'
                  }}
                />
              ) : (
                <div className="relative w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full bg-gray-800/50 flex items-center justify-center text-7xl lg:text-9xl font-bold text-gray-500 transition-all duration-300">
                  {profile.fullName.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-4 relative z-10 text-center">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500 drop-shadow-md">
                Hi, I'm <span className="">{profile.fullName}</span>
              </h1>
              {profile.headline && (
                <p className="text-2xl sm:text-3xl text-gray-300 font-light">
                  {profile.headline}
                </p>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center relative z-20">
            {journeyTarget && (
              <Link
                href={journeyTarget}
                className="group relative px-8 py-3 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 flex items-center gap-2 transition-all duration-300"
              >
                View Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {isVisible('blog') && (
              <Link
                href="/blog"
                className="px-8 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Read Blog
              </Link>
            )}
            <Link
              href="/contact"
              className="px-8 py-3 rounded-full bg-linear-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Contact
            </Link>
          </div>

          {profile.cvUrl && (
            <CvDownloadButton label={`Download CV${profile.cvDisplayName ? ` (${profile.cvDisplayName})` : ''}`} />
          )}

          {/* Social Links */}
          <div className="flex gap-6 opacity-80 hover:opacity-100 transition-opacity relative z-20">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-all transform hover:-translate-y-1">
                <Linkedin size={28} />
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all transform hover:-translate-y-1">
                <Github size={28} />
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="text-gray-400 hover:text-red-400 transition-all transform hover:-translate-y-1">
                <Mail size={28} />
              </a>
            )}
          </div>
        </div>

        {/* Content-driven sections: only visible ones render, in configured order */}
        <PortfolioSections portfolio={portfolio} />

      </main>

      <footer className="mt-24 text-sm text-gray-600 flex flex-col items-center gap-3">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {portfolio.nav.filter(l => !l.external).map(l => (
            <Link key={l.href} href={l.href} className="hover:text-gray-300">{l.label}</Link>
          ))}
        </nav>
        <p>&copy; {new Date().getFullYear()} {profile.fullName}. <span className="text-gray-700 mx-2">|</span> Built for the Cloud.</p>
      </footer>
    </div>
  );
}
