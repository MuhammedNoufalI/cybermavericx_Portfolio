// One-off: move the current CV out of public/uploads (where it was directly
// downloadable, bypassing the captcha) into private_uploads/, and update the DB.
// Usage: node scripts/move-cv-private.js
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

async function main() {
    const prisma = new PrismaClient()
    try {
        const toDir = path.join(process.cwd(), 'private_uploads')
        fs.mkdirSync(toDir, { recursive: true })

        const profile = await prisma.profile.findFirst({ select: { id: true, cvUrl: true } })
        if (profile?.cvUrl) {
            // Works whether the DB still has "/uploads/x.pdf" or already "private:x.pdf"
            const name = path.basename(profile.cvUrl.replace(/^private:/, ''))
            const from = path.join(process.cwd(), 'public', 'uploads', name)
            const to = path.join(toDir, name)
            if (fs.existsSync(from)) fs.renameSync(from, to)
            if (!fs.existsSync(to)) throw new Error(`CV file not found in public/uploads or private_uploads: ${name}`)
            if (profile.cvUrl !== `private:${name}`) {
                await prisma.profile.update({ where: { id: profile.id }, data: { cvUrl: `private:${name}` } })
            }
            console.log(`CV stored at ${to}; cvUrl = private:${name}`)
        } else {
            console.log('No CV set.')
        }

        // Move any other stray PDFs out of the public folder
        for (const f of fs.readdirSync(path.join(process.cwd(), 'public', 'uploads'))) {
            if (f.toLowerCase().endsWith('.pdf')) {
                fs.renameSync(path.join(process.cwd(), 'public', 'uploads', f), path.join(toDir, f))
                console.log('Also moved stray PDF:', f)
            }
        }
    } finally {
        await prisma.$disconnect()
    }
}

main().catch(e => { console.error(e); process.exit(1) })
