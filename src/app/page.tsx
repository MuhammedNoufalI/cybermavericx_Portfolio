
import { prisma } from '@/lib/prisma'
import { ArrowRight, Github, Linkedin, Mail, Twitter } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github-dark.css'
import { Certification } from '@prisma/client'

export default async function Home() {
  const profile = await prisma.profile.findFirst()
  const certs = await prisma.certification.findMany({
    orderBy: { issueDate: 'desc' },
    take: 4
  })

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-blue-500 animate-pulse">Initializing System...</div>
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] pt-24 overflow-hidden">
      <main className="flex flex-col gap-12 items-center text-center max-w-4xl w-full">

        {/* Hero Section */}
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
            <p className="text-2xl sm:text-3xl text-gray-300 font-light">
              {profile.headline}
            </p>


            <div className="text-base sm:text-lg text-gray-400 max-w-4xl mx-auto leading-relaxed text-left markdown-bio prose prose-invert prose-p:my-2 prose-a:text-blue-400 prose-strong:text-white">
              <ReactMarkdown rehypePlugins={[rehypeHighlight, rehypeRaw]}>
                {profile.bio}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-4 relative z-20">
          <Link
            href="/journey"
            className="group relative px-8 py-3 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 flex items-center gap-2 transition-all duration-300"
          >
            View Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/blog"
            className="px-8 py-3 rounded-full bg-linear-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Read Blog
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 rounded-full bg-linear-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Contact
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 mt-4 opacity-80 hover:opacity-100 transition-opacity relative z-20">
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
          <a href={`mailto:${profile.email}`} className="text-gray-400 hover:text-red-400 transition-all transform hover:-translate-y-1">
            <Mail size={28} />
          </a>
        </div>

        {/* Certifications Preview */}
        {certs.length > 0 && (
          <div className="w-full mt-16 pt-16 border-t border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 relative z-20">
            <h2 className="text-2xl font-bold mb-8 text-gray-200">Latest Certifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {certs.map((cert: Certification) => (
                <div key={cert.id} className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-[#161b22] border border-white/5 hover:border-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
                  {cert.imageUrl ? (
                    <img src={cert.imageUrl} alt={cert.name} className="w-16 h-16 object-contain drop-shadow-md" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500">
                      <span className="text-xs">No Img</span>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="font-semibold text-sm text-gray-200 group-hover:text-blue-400 transition-colors line-clamp-2">{cert.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{cert.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <footer className="mt-24 text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} {profile.fullName}. <span className="text-gray-700 mx-2">|</span> Built for the Cloud.</p>
      </footer>
    </div>
  );
}
