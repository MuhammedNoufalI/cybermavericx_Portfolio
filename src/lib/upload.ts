
import { writeFile, mkdir, unlink, access } from 'fs/promises'
import { join } from 'path'

export async function deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return

    // Extract filename from URL (e.g. /uploads/123.pdf -> 123.pdf)
    const filename = fileUrl.split('/').pop()
    if (!filename) return

    const filepath = join(process.cwd(), 'public', 'uploads', filename)

    try {
        await access(filepath) // Check if exists
        await unlink(filepath) // Delete
        console.log(`Deleted old file: ${filepath}`)
    } catch (error) {
        console.error(`Failed to delete file ${filepath}:`, error)
        // Ignore if file doesn't exist
    }
}

export async function saveFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (error) {
        // Ignore error if directory already exists
    }

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = file.name.split('.').pop()
    const filename = `${uniqueSuffix}.${ext}`
    const filepath = join(uploadDir, filename)

    // Write file
    await writeFile(filepath, buffer)

    // Return public URL
    return `/uploads/${filename}`
}
