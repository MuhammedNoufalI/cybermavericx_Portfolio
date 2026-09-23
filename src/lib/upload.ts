
import { writeFile, mkdir, unlink, access } from 'fs/promises'
import { join, basename } from 'path'

// Public files (images) are served via /uploads/<name>.
// Private files (the CV) live outside public/ and are referenced as "private:<name>";
// they are only reachable through /api/download/cv after a reCAPTCHA check.
export const PUBLIC_UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
export const PRIVATE_UPLOAD_DIR = join(process.cwd(), 'private_uploads')
const PRIVATE_PREFIX = 'private:'

export function resolveStoredFile(fileUrl: string): string | null {
    if (!fileUrl) return null
    if (fileUrl.startsWith(PRIVATE_PREFIX)) {
        const name = basename(fileUrl.slice(PRIVATE_PREFIX.length))
        return name ? join(PRIVATE_UPLOAD_DIR, name) : null
    }
    const name = basename(fileUrl)
    return name ? join(PUBLIC_UPLOAD_DIR, name) : null
}

export async function deleteFile(fileUrl: string): Promise<void> {
    const filepath = resolveStoredFile(fileUrl)
    if (!filepath) return

    try {
        await access(filepath) // Check if exists
        await unlink(filepath) // Delete
        console.log(`Deleted old file: ${filepath}`)
    } catch (error) {
        console.error(`Failed to delete file ${filepath}:`, error)
        // Ignore if file doesn't exist
    }
}

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']

export async function saveFile(file: File, opts: { private?: boolean; allowed?: string[] } = {}): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = (file.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    const allowed = opts.allowed ?? IMAGE_EXTS
    if (!allowed.includes(ext)) {
        throw new Error(`File type .${ext} not allowed (expected: ${allowed.join(', ')})`)
    }

    const uploadDir = opts.private ? PRIVATE_UPLOAD_DIR : PUBLIC_UPLOAD_DIR
    await mkdir(uploadDir, { recursive: true })

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filename = `${uniqueSuffix}.${ext}`
    await writeFile(join(uploadDir, filename), buffer)

    return opts.private ? `${PRIVATE_PREFIX}${filename}` : `/uploads/${filename}`
}
