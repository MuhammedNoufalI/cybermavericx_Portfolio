
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'

// --- Jobs ---

export async function createJob(formData: FormData) {
    await requireAdmin()
    const company = formData.get('company') as string
    const position = formData.get('position') as string
    const startDate = new Date(formData.get('startDate') as string)
    const endDateRaw = formData.get('endDate') as string
    const endDate = endDateRaw ? new Date(endDateRaw) : null
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const technologies = formData.get('technologies') as string

    await prisma.job.create({
        data: {
            company,
            position,
            startDate,
            endDate,
            description,
            location,
            technologies,
        },
    })

    revalidatePath('/')
    revalidatePath('/admin/jobs')
    redirect('/admin/jobs')
}

export async function updateJob(id: string, formData: FormData) {
    await requireAdmin()
    const company = formData.get('company') as string
    const position = formData.get('position') as string
    const startDate = new Date(formData.get('startDate') as string)
    const endDateRaw = formData.get('endDate') as string
    const endDate = endDateRaw ? new Date(endDateRaw) : null
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const technologies = formData.get('technologies') as string

    await prisma.job.update({
        where: { id },
        data: {
            company,
            position,
            startDate,
            endDate,
            description,
            location,
            technologies,
        },
    })

    revalidatePath('/')
    revalidatePath('/admin/jobs')
    redirect('/admin/jobs')
}

export async function deleteJob(id: string) {
    await requireAdmin()
    await prisma.job.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/jobs')
}

// --- Blogs ---

export async function createBlog(formData: FormData) {
    await requireAdmin()
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const tags = formData.get('tags') as string
    const references = formData.get('references') as string
    const advertising = formData.get('advertising') as string

    await prisma.blog.create({
        data: {
            title,
            slug,
            content,
            excerpt,
            tags,
            references,
            advertising,
            published: true // auto publish for now
        }
    })

    revalidatePath('/blog')
    revalidatePath('/admin/blogs')
    redirect('/admin/blogs')
}

export async function updateBlog(id: string, formData: FormData) {
    await requireAdmin()
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const tags = formData.get('tags') as string
    const references = formData.get('references') as string
    const advertising = formData.get('advertising') as string

    await prisma.blog.update({
        where: { id },
        data: {
            title,
            slug,
            content,
            excerpt,
            tags,
            references,
            advertising,
        }
    })

    revalidatePath('/blog')
    revalidatePath('/admin/blogs')
    redirect('/admin/blogs')
}

export async function deleteBlog(id: string) {
    await requireAdmin()
    await prisma.blog.delete({ where: { id } })
    revalidatePath('/blog')
    revalidatePath('/admin/blogs')
}

// --- Messages ---

export async function deleteMessage(id: string) {
    await requireAdmin()
    await (prisma as any).message.delete({ where: { id } })
    revalidatePath('/admin/messages')
}

export async function markMessageRead(id: string) {
    await requireAdmin()
    const msg = await (prisma as any).message.findUnique({ where: { id } })
    if (msg) {
        await (prisma as any).message.update({
            where: { id },
            data: { read: !msg.read }
        })
        revalidatePath('/admin/messages')
    }
}

// --- External Pages ---

export async function createExternalPage(formData: FormData) {
    await requireAdmin()
    const title = formData.get('title') as string
    const url = formData.get('url') as string

    await prisma.externalPage.create({
        data: {
            title,
            url
        }
    })

    revalidatePath('/')
    revalidatePath('/admin/pages')
    redirect('/admin/pages')
}

export async function deleteExternalPage(id: string) {
    await requireAdmin()
    await prisma.externalPage.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/pages')
}
