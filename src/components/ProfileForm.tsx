'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ImageCropper from './ImageCropper'
import MarkdownEditor from './MarkdownEditor'

interface ProfileFormProps {
    profile: any
    updateProfileAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export default function ProfileForm({ profile, updateProfileAction }: ProfileFormProps) {
    console.log('ProfileForm Client Props:', profile)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.imageUrl)
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImageSrc(reader.result as string)
            })
            reader.readAsDataURL(file)
            e.target.value = ''
        }
    }

    const onCropComplete = (blob: Blob) => {
        setCroppedBlob(blob)
        setPreviewUrl(URL.createObjectURL(blob))
        setImageSrc(null) // Close cropper
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)

        if (croppedBlob) {
            formData.set('image', croppedBlob, 'profile.png')
        }

        const result = await updateProfileAction(formData)
        setIsSubmitting(false)

        if (result && result.success) {
            alert('Profile updated successfully!')
            router.refresh()
        } else {
            alert('Error updating profile: ' + (result?.error || 'Unknown error'))
        }
    }

    return (
        <>
            {imageSrc && (
                <ImageCropper
                    imageSrc={imageSrc}
                    onCropComplete={onCropComplete}
                    onCancel={() => setImageSrc(null)}
                />
            )}

            <form onSubmit={onSubmit} className="space-y-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <input type="hidden" name="id" value={profile.id} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Colors */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-3 text-gray-700">Theme Color</label>
                        <div className="flex gap-4">
                            {['purple', 'blue', 'green', 'orange', 'red', 'pink'].map(color => (
                                <label key={color} className="cursor-pointer relative group">
                                    <input type="radio" name="themeColor" value={color} defaultChecked={profile.themeColor === color} className="peer sr-only" />
                                    <div className={`w-10 h-10 rounded-full border-2 border-gray-200 peer-checked:border-gray-900 peer-checked:scale-110 transition-all ${color === 'purple' ? 'bg-purple-600' :
                                        color === 'blue' ? 'bg-blue-600' :
                                            color === 'green' ? 'bg-green-600' :
                                                color === 'orange' ? 'bg-orange-600' :
                                                    color === 'red' ? 'bg-red-600' :
                                                        'bg-pink-600'
                                        }`}></div>
                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 capitalize">{color}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2 grid grid-cols-2 gap-8">
                        <div className="">
                            <label className="block text-sm font-medium mb-2 text-gray-700">Profile Image</label>
                            <div className="flex gap-4 items-center mb-2">
                                {previewUrl && (
                                    <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm" />
                                )}
                                <div className="flex-1">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={onFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Select an image to resize and crop.</p>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <label className="block text-sm font-medium mb-2 text-gray-700">Website Logo (Favicon)</label>
                            <div className="flex gap-4 items-center mb-2">
                                {(profile as any).logoUrl && (
                                    <img src={(profile as any).logoUrl} alt="Logo" className="w-16 h-16 object-contain border border-gray-300 shadow-sm p-2 bg-gray-50 rounded-lg" />
                                )}
                                <div className="flex-1">
                                    <input
                                        name="logo"
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Square image (PNG/JPG) recommended.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CV Upload Enabled */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-700">CV / Resume (PDF)</label>
                        <div className="flex gap-4 items-center mb-2">
                            {(profile as any).cvUrl && (
                                <a href={(profile as any).cvUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                    View Current CV
                                </a>
                            )}
                            <div className="flex-1">
                                <input
                                    name="cv"
                                    type="file"
                                    accept=".pdf"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 mt-1">PDF format only.</p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <label className="block text-xs font-medium mb-1 text-gray-500">Download Filename (Optional)</label>
                            <input
                                name="cvDisplayName"
                                type="text"
                                defaultValue={(profile as any).cvDisplayName || ''}
                                placeholder="e.g. My_CV_2024.pdf"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                        <input name="fullName" type="text" defaultValue={profile.fullName} required className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-transparent text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Headline</label>
                        <input name="headline" type="text" defaultValue={profile.headline} required className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-transparent text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2 text-gray-700">Bio (Markdown Supported)</label>
                    <MarkdownEditor name="bio" initialValue={profile.bio} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                        <input name="email" type="email" defaultValue={profile.email} required className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-transparent text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Phone</label>
                        <input name="phone" type="text" defaultValue={profile.phone || ''} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-transparent text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">LinkedIn URL</label>
                        <input name="linkedinUrl" type="url" defaultValue={profile.linkedinUrl || ''} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-transparent text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">GitHub URL</label>
                        <input name="githubUrl" type="url" defaultValue={profile.githubUrl || ''} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-transparent text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                        Blog Settings
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-70">Blog Title</label>
                            <input name="blogTitle" type="text" defaultValue={(profile as any).blogTitle || 'Blog'} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-70">Blog Slogan / Headline</label>
                            <input name="blogHeadline" type="text" defaultValue={(profile as any).blogHeadline || ''} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" placeholder="Insights about Cloud & DevOps" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 opacity-70">Header Gradient Style</label>
                        <select name="blogGradient" defaultValue={(profile as any).blogGradient || 'from-blue-400 to-purple-500'} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 cursor-pointer">
                            <option value="from-blue-400 to-purple-500">Blue to Purple (Default)</option>
                            <option value="from-purple-400 via-pink-400 to-red-400">Sunset Neon (Purple-Pink-Red)</option>
                            <option value="from-green-400 to-blue-500">Ocean (Green-Blue)</option>
                            <option value="from-yellow-400 via-orange-500 to-red-500">Fire (Yellow-Orange-Red)</option>
                            <option value="from-cyan-400 via-blue-500 to-purple-600">Cyberpunk (Cyan-Blue-Purple)</option>
                            <option value="from-pink-500 via-red-500 to-yellow-500">Heat (Pink-Red-Yellow)</option>
                            <option value="from-gray-200 via-gray-400 to-gray-600">Monochrome (Silver)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Required: Use Tailwind gradient classes (from-X to-Y).</p>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button type="submit" className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm active:scale-95 transform">Update Profile</button>
                </div>
            </form>
        </>
    )
}
