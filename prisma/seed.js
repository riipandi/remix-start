const { PrismaClient } = require('@prisma/client')
const bcrypt = require('@node-rs/bcrypt')

const prisma = new PrismaClient()

async function seed() {
  const email = 'aris@duck.com'

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {})

  const passwordHash = await bcrypt.hash('passw0rd', 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: passwordHash,
        },
      },
    },
  })

  await prisma.note.create({
    data: {
      title: 'My first note',
      body: 'Hello, world!',
      userId: user.id,
    },
  })

  await prisma.note.create({
    data: {
      title: 'My second note',
      body: 'Hello, world!',
      userId: user.id,
    },
  })

  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
