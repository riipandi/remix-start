import bcrypt from '@node-rs/bcrypt'
import type { PrismaClient } from '@prisma/client'

export const DefaultUserSeeder = async (prisma: PrismaClient) => {
  const hash = await bcrypt.hash('passw0rd')
  const email = 'aris@duck.com'

  // cleanup the existing database before seeding new user
  await prisma.user.delete({ where: { email } }).catch(() => {})

  return await prisma.user.create({
    data: {
      email,
      username: 'riipandi',
      firstName: 'Aris',
      lastName: 'Ripandi',
      emailVerifiedAt: new Date(),
      password: {
        create: { hash },
      },
    },
  })
}
