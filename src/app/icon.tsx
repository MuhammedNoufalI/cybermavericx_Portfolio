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

    if (logoUrl && logoUrl.startsWith('/uploads')) {
        const fullPath = join(process.cwd(), 'public', logoUrl)
        try {
            const imageBuffer = readFileSync(fullPath)
            const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`

            return new ImageResponse(
                (
                    <div
                        style={{
                            background: 'transparent',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Use objectFit 'contain' and pass numbers as strings properly to avoid satori errors */}
                        <img src={imageBase64} width="32" height="32" />
                    </div>
                ),
                { ...size }
            )
        } catch (e) {
            console.error('Missing logo file, falling back to default icon.')
        }
    }

    // Fallback if no logo or file missing
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
                    borderRadius: 16 // Fix: Cannot use '50%' in Satori
                }}
            >
                D
            </div>
        ),
        { ...size }
    )
}
