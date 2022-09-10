import type { PrismaClient } from '@prisma/client'
import { hash as bcryptHash } from '@node-rs/bcrypt'

export const DefaultUserSeeder = async (prisma: PrismaClient) => {
  const hash = await bcryptHash('passw0rd', 10)
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
