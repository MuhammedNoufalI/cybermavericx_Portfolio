import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
    const { filename } = await params
    const filepath = join(process.cwd(), 'public', 'uploads', filename)
    
    if (!existsSync(filepath)) {
        return new NextResponse('Not Found', { status: 404 })
    }

    const file = readFileSync(filepath)
    
    let contentType = 'application/octet-stream'
    if (filename.endsWith('.png')) contentType = 'image/png'
    else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) contentType = 'image/jpeg'
    else if (filename.endsWith('.pdf')) contentType = 'application/pdf'
    else if (filename.endsWith('.gif')) contentType = 'image/gif'
    else if (filename.endsWith('.svg')) contentType = 'image/svg+xml'

    return new NextResponse(file, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    })
}
