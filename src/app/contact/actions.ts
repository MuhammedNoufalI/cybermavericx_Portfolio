'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { verifyRecaptcha, log as logRecaptcha } from '@/lib/recaptcha'
import { RECAPTCHA_ACTIONS, RECAPTCHA_GENERIC_ERROR } from '@/lib/recaptcha-config'
import { rateLimit } from '@/lib/rate-limit'
import { clientMeta } from '@/lib/request-meta'
import { formatTime, getAttribution } from '@/lib/visitor'

// Public action — kept out of admin/actions.ts so importing it doesn't
// pull admin actions into a public page's action graph.

export type ContactState = { ok: boolean; error?: string } | null

const escapeMd = (s: string) => s.replace(/([_*`\[])/g, '\\$1')

export async function submitMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
    // Honeypot: pretend success, process nothing, no assessment
    if (String(formData.get('website') || '').trim()) {
        return { ok: true }
    }

    const name = String(formData.get('name') || '').trim().slice(0, 200)
    const email = String(formData.get('email') || '').trim().slice(0, 200)
    const content = String(formData.get('message') || '').trim().slice(0, 5000)
    const token = formData.get('recaptchaToken') as string | null

    if (!name || !email || !content || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, error: 'Please fill in all fields with a valid email.' }
    }

    const meta = clientMeta(await headers())

    // Free checks before the billable assessment: token present, then rate limit
    if (!token && process.env.NODE_ENV === 'production') {
        logRecaptcha({ action: RECAPTCHA_ACTIONS.contact, outcome: 'reject', reason: 'missing-token', ip: meta.ip })
        return { ok: false, error: RECAPTCHA_GENERIC_ERROR }
    }
    if (!(await rateLimit('contact', meta.ip)).ok) {
        return { ok: false, error: 'Too many attempts. Please wait a few minutes and try again.' }
    }

    const check = await verifyRecaptcha(token, RECAPTCHA_ACTIONS.contact, meta)
    if (!check.ok) return { ok: false, error: RECAPTCHA_GENERIC_ERROR }

    await prisma.message.create({ data: { name, email, content } })

    try {
        const { link, source } = await getAttribution()
        const text = [
            `📩 *New Contact Message*`,
            ``,
            `*Name:* ${escapeMd(name)}`,
            `*Email:* ${escapeMd(email)}`,
            link && `🔗 *Link:* ${escapeMd(link.label)}`,
            source && source !== 'direct' && `↪️ *Came from:* ${escapeMd(source)}`,
            `🕒 ${formatTime()}  ·  🌐 ${meta.ip}`,
            ``,
            `*Message:*`,
            escapeMd(content),
        ].filter(v => v !== false && v !== null && v !== undefined).join('\n')
        const { sendTelegramNotification } = await import('@/lib/telegram')
        await sendTelegramNotification(text)
    } catch (error) {
        console.error('Failed to send Telegram notification:', error)
    }

    revalidatePath('/admin/messages')
    return { ok: true }
}
