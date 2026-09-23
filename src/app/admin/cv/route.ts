import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'
import { resolveStoredFile } from '@/lib/upload'

// Admin-only inline view of the current CV (no captcha, no Telegram ping).
export async function GET() {
    if (!(await isAdmin())) return new NextResponse('Unauthorized', { status: 401 })
    const profile = await prisma.profile.findFirst({ select: { cvUrl: true } })
    const filepath = profile?.cvUrl ? resolveStoredFile(profile.cvUrl) : null
    if (!filepath) return new NextResponse('No CV uploaded', { status: 404 })
    try {
        return new NextResponse(await readFile(filepath), {
            headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline', 'Cache-Control': 'no-store' },
        })
    } catch {
        return new NextResponse('CV file missing on disk', { status: 404 })
    }
}
