
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { saveFile } from '@/lib/upload'

// --- Certifications ---

export async function createCertification(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const issuer = formData.get('issuer') as string
    const issueDate = new Date(formData.get('issueDate') as string)
    const credentialUrl = formData.get('credentialUrl') as string
    const imageFile = formData.get('image') as File | null

    let imageUrl = null
    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveFile(imageFile)
    }

    await prisma.certification.create({
        data: {
            name,
            issuer,
            issueDate,
            credentialUrl,
            imageUrl,
        },
    })

    revalidatePath('/')
    revalidatePath('/journey')
    revalidatePath('/admin/certs')
    redirect('/admin/certs')
}

export async function updateCertification(id: string, formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const issuer = formData.get('issuer') as string
    const issueDate = new Date(formData.get('issueDate') as string)
    const credentialUrl = formData.get('credentialUrl') as string
    const imageFile = formData.get('image') as File | null

    // Only update image if a new one is provided
    let imageUrl = undefined
    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveFile(imageFile)
    }

    await prisma.certification.update({
        where: { id },
        data: {
            name,
            issuer,
            issueDate,
            credentialUrl,
            imageUrl,
        }
    })

    revalidatePath('/')
    revalidatePath('/journey')
    revalidatePath('/admin/certs')
    redirect('/admin/certs')
}

export async function deleteCertification(id: string) {
    'use server'
    await prisma.certification.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/journey')
    revalidatePath('/admin/certs')
}
