'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { saveFile } from '@/lib/upload'
import { getCollection, type Collection } from './collections'
import { SECTION_DEFS } from '@/lib/sections'

const delegate = (c: Collection) => (prisma as any)[c.model]

async function parseForm(c: Collection, formData: FormData, isUpdate: boolean) {
    const data: Record<string, unknown> = {}
    for (const f of c.fields) {
        const raw = formData.get(f.name)
        switch (f.type) {
            case 'checkbox':
                data[f.name] = raw === 'on'
                break
            case 'number':
                data[f.name] = Number.parseInt(String(raw ?? '0'), 10) || 0
                break
            case 'date': {
                const s = String(raw ?? '').trim()
                data[f.name] = s ? new Date(s) : null
                break
            }
            case 'image': {
                const file = raw as File | null
                if (formData.get(`${f.name}__remove`) === 'on') data[f.name] = null
                else if (file && typeof file === 'object' && file.size > 0) data[f.name] = await saveFile(file)
                else if (!isUpdate) data[f.name] = null
                break
            }
            default: {
                const s = String(raw ?? '').trim()
                if (f.required && !s) throw new Error(`${f.label} is required`)
                if (f.type === 'url' && s && !/^https?:\/\//i.test(s)) throw new Error(`${f.label} must start with http:// or https://`)
                data[f.name] = s || (f.required ? s : null)
            }
        }
    }
    return data
}

function revalidate(c: Collection) {
    revalidatePath('/', 'layout')
    revalidatePath(`/admin/content/${c.slug}`)
    revalidatePath('/admin/sections')
}

export async function createItem(slug: string, formData: FormData) {
    await requireAdmin()
    const c = getCollection(slug)
    if (!c) throw new Error('Unknown collection')
    await delegate(c).create({ data: await parseForm(c, formData, false) })
    revalidate(c)
    redirect(`/admin/content/${c.slug}`)
}

export async function updateItem(slug: string, id: string, formData: FormData) {
    await requireAdmin()
    const c = getCollection(slug)
    if (!c) throw new Error('Unknown collection')
    await delegate(c).update({ where: { id }, data: await parseForm(c, formData, true) })
    revalidate(c)
    redirect(`/admin/content/${c.slug}`)
}

export async function deleteItem(slug: string, id: string) {
    await requireAdmin()
    const c = getCollection(slug)
    if (!c) throw new Error('Unknown collection')
    await delegate(c).delete({ where: { id } })
    revalidate(c)
}

// --- Section visibility (Published / Disabled) and order ---

const VALID_KEYS = new Set<string>(SECTION_DEFS.map(s => s.key))

export async function setSectionPublished(key: string, published: boolean) {
    await requireAdmin()
    if (!VALID_KEYS.has(key)) throw new Error('Unknown section')
    const order = SECTION_DEFS.findIndex(s => s.key === key)
    await prisma.sectionSetting.upsert({
        where: { key },
        update: { published },
        create: { key, published, order },
    })
    revalidatePath('/', 'layout')
    revalidatePath('/admin/sections')
}

export async function moveSection(key: string, direction: 'up' | 'down') {
    await requireAdmin()
    if (!VALID_KEYS.has(key)) throw new Error('Unknown section')
    const existing = new Map((await prisma.sectionSetting.findMany()).map(s => [s.key, s]))
    const ordered = SECTION_DEFS
        .map((d, i) => ({ key: d.key as string, order: existing.get(d.key)?.order ?? i, published: existing.get(d.key)?.published ?? true }))
        .sort((a, b) => a.order - b.order)
    const idx = ordered.findIndex(s => s.key === key)
    const swap = direction === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= ordered.length) return
    ;[ordered[idx], ordered[swap]] = [ordered[swap], ordered[idx]]
    await prisma.$transaction(ordered.map((s, i) => prisma.sectionSetting.upsert({
        where: { key: s.key },
        update: { order: i },
        create: { key: s.key, order: i, published: s.published },
    })))
    revalidatePath('/', 'layout')
    revalidatePath('/admin/sections')
}
