'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { clientMeta } from '@/lib/request-meta'

// Public action — kept out of admin/actions.ts so importing it doesn't
// pull admin actions into a public page's action graph.

export type ContactState = { ok: boolean; error?: string } | null

const escapeMd = (s: string) => s.replace(/([_*`\[])/g, '\\$1')

export async function submitMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
    const name = String(formData.get('name') || '').trim().slice(0, 200)
    const email = String(formData.get('email') || '').trim().slice(0, 200)
    const content = String(formData.get('message') || '').trim().slice(0, 5000)
    const token = formData.get('recaptchaToken') as string | null

    if (!name || !email || !content || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, error: 'Please fill in all fields with a valid email.' }
    }

    const meta = clientMeta(await headers())
    const check = await verifyRecaptcha(token, 'contact', meta)
    if (!check.ok) {
        console.warn('[Contact] Blocked submission:', check.reason, meta.ip)
        return { ok: false, error: 'Verification failed. Please try again.' }
    }

    await prisma.message.create({ data: { name, email, content } })

    try {
        const text = `📩 *New Contact Message*\n\n*Name:* ${escapeMd(name)}\n*Email:* ${escapeMd(email)}\n*IP:* ${meta.ip}\n\n*Message:*\n${escapeMd(content)}`
        const { sendTelegramNotification } = await import('@/lib/telegram')
        await sendTelegramNotification(text)
    } catch (error) {
        console.error('Failed to send Telegram notification:', error)
    }

    revalidatePath('/admin/messages')
    return { ok: true }
}
