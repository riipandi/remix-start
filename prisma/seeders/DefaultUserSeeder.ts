// import bcrypt from '@node-rs/bcrypt'
import type { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'crypto'

/**
 * Hash password with random salt
 * @return {string} password hash followed by salt
 *  XXXX till 64 XXXX till 32
 *
 */
const hashPassword = async (password: string): Promise<string> => {
  // Any random string here (ideally should be atleast 16 bytes)
  const salt = randomBytes(16).toString('hex')
  const encrypted = scryptSync(password, salt, 32).toString('hex')
  return encrypted + salt
}

export const DefaultUserSeeder = async (prisma: PrismaClient) => {
  const hash = await hashPassword('passw0rd')
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
