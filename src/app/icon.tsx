import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'
import { join } from 'path'
import { readFileSync } from 'fs'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default async function Icon() {
    // Fetch profile logo
    const profile = await prisma.profile.findFirst()
    const logoUrl = profile?.logoUrl

    if (logoUrl) {
        // If it's a local file (begins with /uploads), we need to read it
        if (logoUrl.startsWith('/uploads')) {
            // This is tricky with ImageResponse and local files in Next.js
            // Usually ImageResponse expects a URL or standard CSS
            // For now, simpler fallback: stick to Emoji or Text if Image fails
            // OR return a redirect/rewrite if possible (not in Icon())

            // BETTER APPROACH: Just fetch the image bytes if full URL, or serve 
            // If we want to serve the EXACT upload as favicon, we should likely
            // just rely on a standard <link rel="icon"> in layout if we want 100% fidelity
            // But `src/app/icon.tsx` is strictly for *generating* icons

            // Let's try to render it as an img tag within the response
            const fullPath = join(process.cwd(), 'public', logoUrl)
            try {
                const imageBuffer = readFileSync(fullPath)
                const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`

                return new ImageResponse(
                    (
                        <div
                            style={{
                                fontSize: 24,
                                background: 'transparent',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <img src={imageBase64} width="32" height="32" style={{ objectFit: 'contain' }} />
                        </div>
                    ),
                    { ...size }
                )
            } catch (e) {
                console.error('Error reading favicon source:', e)
            }
        }
    }

    // Fallback if no logo
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: 'black',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '50%'
                }}
            >
                D
            </div>
        ),
        { ...size }
    )
}
