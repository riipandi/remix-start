import { PrismaClient } from '@prisma/client'
import { DefaultUserSeeder } from './seeders/DefaultUserSeeder'
import { SampleNoteSeeder } from './seeders/SampleNoteSeeder'

const prisma: PrismaClient = new PrismaClient()

async function seed() {
  const user = await DefaultUserSeeder(prisma)
  await SampleNoteSeeder(prisma, user)
  console.info(`Database has been seeded. 🌱`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
