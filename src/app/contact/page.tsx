
import { Mail, Linkedin, Github } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { submitMessage } from '../admin/actions'

export default async function Contact() {
    const profile = await prisma.profile.findFirst()

    return (
        <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">Get In Touch</h1>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-lg mb-12">
                I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="bg-[#120822]/60 backdrop-blur-md p-8 rounded-2xl border border-purple-500/10 shadow-lg shadow-purple-500/5">
                        <h2 className="text-xl font-semibold mb-6 text-gray-100">Contact Details</h2>

                        <div className="space-y-6">
                            <a href={`mailto:${profile?.email}`} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                                    <p className="font-medium text-gray-200">{profile?.email}</p>
                                </div>
                            </a>

                            {profile?.linkedinUrl && (
                                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-[#0077b5] group-hover:text-white transition-all">
                                        <Linkedin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">LinkedIn</p>
                                        <p className="font-medium text-gray-200">Connect with me</p>
                                    </div>
                                </a>
                            )}

                            {profile?.githubUrl && (
                                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all">
                                        <Github size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">GitHub</p>
                                        <p className="font-medium text-gray-200">Follow my work</p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <form action={async (formData) => {
                    'use server'
                    await submitMessage(formData)
                }} className="bg-[#120822]/60 backdrop-blur-md p-8 rounded-2xl border border-purple-500/10 shadow-lg shadow-purple-500/5 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                        <input name="name" type="text" id="name" required className="w-full px-4 py-3 rounded-lg bg-[#0d1117]/50 border border-gray-700 text-gray-100 focus:border-purple-500 focus:bg-[#0d1117] focus:ring-1 focus:ring-purple-500 outline-none transition-colors" placeholder="John Doe" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input name="email" type="email" id="email" required className="w-full px-4 py-3 rounded-lg bg-[#0d1117]/50 border border-gray-700 text-gray-100 focus:border-purple-500 focus:bg-[#0d1117] focus:ring-1 focus:ring-purple-500 outline-none transition-colors" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                        <textarea name="message" id="message" rows={4} required className="w-full px-4 py-3 rounded-lg bg-[#0d1117]/50 border border-gray-700 text-gray-100 focus:border-purple-500 focus:bg-[#0d1117] focus:ring-1 focus:ring-purple-500 outline-none transition-colors" placeholder="Hello..." />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-500/25 hover:scale-[1.02]">
                        Send Message
                    </button>
                </form>
            </div>

            <div className="mt-20 text-center">
                <a href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white underline">Back Home</a>
            </div>
        </div>
    )
}
