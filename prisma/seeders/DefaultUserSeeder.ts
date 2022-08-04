import type { PrismaClient } from '@prisma/client'
import { hash } from '@node-rs/bcrypt'

export const DefaultUserSeeder = async (prisma: PrismaClient) => {
  const email = 'aris@duck.com'
  const passwordHash = await hash('passw0rd', 10)

  // cleanup the existing database before seeding new user
  await prisma.user.delete({ where: { email } }).catch(() => {})

  return await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: passwordHash,
        },
      },
    },
  })
}
