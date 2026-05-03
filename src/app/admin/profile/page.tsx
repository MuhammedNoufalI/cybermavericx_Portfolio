import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { saveFile, deleteFile } from '@/lib/upload'

async function updateProfile(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const fullName = formData.get('fullName') as string
    const headline = formData.get('headline') as string
    const bio = formData.get('bio') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const linkedinUrl = formData.get('linkedinUrl') as string
    const githubUrl = formData.get('githubUrl') as string
    const themeColor = formData.get('themeColor') as string
    const imageFile = formData.get('image') as File | null
    const logoFile = formData.get('logo') as File | null

    let imageUrl = undefined
    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveFile(imageFile)
    }

    let logoUrl = undefined
    if (logoFile && logoFile.size > 0) {
        logoUrl = await saveFile(logoFile)
    }

    const cvFile = formData.get('cv') as File | null
    console.log('CV File received:', cvFile ? { name: cvFile.name, size: cvFile.size, type: cvFile.type } : 'null')

    let cvUrl = undefined
    if (cvFile && cvFile.size > 0) {
        try {
            // Check for existing profile to replace old file
            const currentProfile = await prisma.profile.findFirst({ select: { cvUrl: true } })
            if (currentProfile?.cvUrl) {
                console.log('Deleting old CV:', currentProfile.cvUrl)
                await deleteFile(currentProfile.cvUrl)
            }

            cvUrl = await saveFile(cvFile)
            console.log('CV Saved to:', cvUrl)
        } catch (err) {
            console.error('CV Save Error:', err)
        }
    } else {
        console.log('No new CV file to save.')
    }

    const updateData = {
        fullName,
        headline,
        bio,
        email,
        phone: phone || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        themeColor,
        ...(imageUrl && { imageUrl }),
        ...(logoUrl && { logoUrl }),
        ...(cvUrl && { cvUrl }),
        cvDisplayName: formData.get('cvDisplayName') as string || null,
        blogTitle: formData.get('blogTitle') as string || 'Blog',
        blogHeadline: formData.get('blogHeadline') as string || null,
        blogGradient: formData.get('blogGradient') as string || null,
    }

    console.log('Prisma Update Data:', JSON.stringify(updateData, null, 2))

    try {
        await (prisma as any).profile.update({
            where: { id },
            data: updateData,
        })

        revalidatePath('/', 'layout') // Revalidate layout to apply theme color
        revalidatePath('/contact')
        revalidatePath('/admin/profile')

        return { success: true }
    } catch (error: any) {
        console.error('Profile Update Error:', error)
        return {
            success: false,
            error: `Database Error: ${error?.message || String(error)}`
        }
    }
}

import ProfileForm from '@/components/ProfileForm'

export default async function AdminProfile() {
    const profile = await prisma.profile.findFirst()
    console.log('AdminProfile RENDER:', profile ? { id: profile.id, cvUrl: profile.cvUrl } : 'No Profile')

    if (!profile) return <div>No profile found. Seed DB first.</div>

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Edit Profile</h1>
            <ProfileForm profile={profile} updateProfileAction={updateProfile} />
        </div>
    )
}
