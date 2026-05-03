import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existingProfile = await prisma.profile.findFirst()

  if (!existingProfile) {
    const profile = await prisma.profile.create({
      data: {
        fullName: 'Muhammed Noufal',
        headline: 'DevOps Engineer',
        bio: 'Welcome to my portfolio. This is a generic bio that I need to update.',
        email: 'your.email@example.com',
        phone: '',
        location: '',
        themeColor: 'purple',
        blogTitle: 'DevOps Blog',
      },
    })
    console.log('Created default profile:', profile.fullName)
  } else {
    console.log('Profile already exists.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
