import type { User } from '@prisma/client'
import bcrypt from '@node-rs/bcrypt'
import { prisma } from '@/db.server'

export async function findUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } })
}

export async function findUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } })
}

export async function createUser(email: User['email'], password: string) {
  const hash = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: {
      email,
      password: {
        create: { hash },
      },
    },
  })
}

export async function deleteUserByEmail(email: User['email']) {
  return prisma.user.delete({ where: { email } })
}
