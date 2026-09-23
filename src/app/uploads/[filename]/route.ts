import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, basename } from 'path'

// Serves uploaded images only. PDFs (CVs) are never served from here —
// they go through /api/download/cv, which requires reCAPTCHA.
const CONTENT_TYPES: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
}

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
    const { filename: raw } = await params
    const filename = basename(raw)
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    const contentType = CONTENT_TYPES[ext]

    if (filename !== raw || !contentType) {
        return new NextResponse('Not Found', { status: 404 })
    }

    const filepath = join(process.cwd(), 'public', 'uploads', filename)
    if (!existsSync(filepath)) {
        return new NextResponse('Not Found', { status: 404 })
    }

    const file = await readFile(filepath)

    return new NextResponse(file, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Content-Type-Options': 'nosniff',
            // Neutralise scripts inside uploaded SVGs
            'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        },
    })
}
