import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import { resolveStoredFile } from '@/lib/upload'

// Favicon generated from the logo uploaded in Admin → Profile.
// Rendered per request so a new logo shows up without a rebuild.
export const dynamic = 'force-dynamic'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

const MIME: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' }

export default async function Icon() {
    const profile = await prisma.profile.findFirst({ select: { logoUrl: true, fullName: true } })
    const logoUrl = profile?.logoUrl

    if (logoUrl?.startsWith('/uploads/')) {
        const filepath = resolveStoredFile(logoUrl)
        const mime = MIME[logoUrl.split('.').pop()?.toLowerCase() || '']
        if (filepath && mime) {
            try {
                const data = `data:${mime};base64,${(await readFile(filepath)).toString('base64')}`
                return new ImageResponse(
                    (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                            <img src={data} width={32} height={32} style={{ objectFit: 'contain' }} />
                        </div>
                    ),
                    { ...size }
                )
            } catch {
                // fall through to the initial
            }
        }
    }

    const initial = (profile?.fullName || 'P').trim().charAt(0).toUpperCase()
    return new ImageResponse(
        (
            <div style={{ fontSize: 22, fontWeight: 700, background: '#05010d', color: 'white', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                {initial}
            </div>
        ),
        { ...size }
    )
}
