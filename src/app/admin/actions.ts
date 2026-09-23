
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

// URL-safe slug; falls back to the title and is made unique (never a DB crash on duplicates)
async function uniqueSlug(raw: string, title: string, excludeId?: string) {
    const base = (raw || title).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 150) || 'post'
    let slug = base
    for (let i = 2; ; i++) {
        const clash = await prisma.blog.findFirst({ where: { slug, ...(excludeId && { NOT: { id: excludeId } }) }, select: { id: true } })
        if (!clash) return slug
        slug = `${base}-${i}`
    }
}

function blogFields(formData: FormData) {
    return {
        title: String(formData.get('title') || '').trim(),
        content: String(formData.get('content') || ''),
        excerpt: String(formData.get('excerpt') || '').trim() || null,
        tags: String(formData.get('tags') || '').trim() || null,
        references: String(formData.get('references') || '') || null,
        advertising: String(formData.get('advertising') || '') || null,
        published: formData.get('published') === 'on',
    }
}

function revalidateBlog() {
    revalidatePath('/', 'layout') // nav shows/hides Blog
    revalidatePath('/blog')
    revalidatePath('/admin/blogs')
}

export async function createBlog(formData: FormData) {
    await requireAdmin()
    const data = blogFields(formData)
    const slug = await uniqueSlug(String(formData.get('slug') || ''), data.title)
    await prisma.blog.create({ data: { ...data, slug } })
    revalidateBlog()
    redirect('/admin/blogs')
}

export async function updateBlog(id: string, formData: FormData) {
    await requireAdmin()
    const data = blogFields(formData)
    const slug = await uniqueSlug(String(formData.get('slug') || ''), data.title, id)
    await prisma.blog.update({ where: { id }, data: { ...data, slug } })
    revalidateBlog()
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
