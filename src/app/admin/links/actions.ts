'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

const slug = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)

export async function createLink(formData: FormData) {
    await requireAdmin()
    const label = String(formData.get('label') || '').trim().slice(0, 150)
    const note = String(formData.get('note') || '').trim().slice(0, 2000) || null
    if (!label) return
    // readable + unguessable: "enbd-sara-hr-7f3k"
    const suffix = Math.random().toString(36).slice(2, 6)
    const code = `${slug(label) || 'link'}-${suffix}`
    await prisma.trackedLink.create({ data: { code, label, note } })
    revalidatePath('/admin/links')
}

export async function deleteLink(id: string) {
    await requireAdmin()
    await prisma.trackedLink.delete({ where: { id } })
    revalidatePath('/admin/links')
}
