
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification } from '@/lib/telegram'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const profile = await prisma.profile.findFirst({
            select: { cvUrl: true, cvDisplayName: true }
        })

        if (!profile || !profile.cvUrl) {
            return new NextResponse('CV not found', { status: 404 })
        }

        // Send Telegram Notification
        const ip = request.headers.get('x-forwarded-for') || 'Unknown IP'
        const userAgent = request.headers.get('user-agent') || 'Unknown User Agent'
        const timestamp = new Date().toLocaleString()

        const message = `📥 *CV Downloaded*\n\n*Time:* ${timestamp}\n*IP:* ${ip}\n*User Agent:* ${userAgent}`

        // Fire and forget notification to not block download
        sendTelegramNotification(message).catch(err => console.error('CV Notification Error:', err))

        // Serve File
        // cvUrl is like /uploads/filename.pdf
        const filename = profile.cvUrl.split('/').pop()
        if (!filename) return new NextResponse('Invalid file path', { status: 500 })

        const filepath = join(process.cwd(), 'public', 'uploads', filename)
        const fileBuffer = await readFile(filepath)

        const downloadName = profile.cvDisplayName || filename

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${downloadName}"`,
            },
        })

    } catch (error) {
        console.error('Download Error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
