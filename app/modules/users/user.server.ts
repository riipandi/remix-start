import type { User, VerificationToken } from '@prisma/client'
import bcrypt from '@node-rs/bcrypt'
import * as crypto from 'crypto'
import { addDays } from 'date-fns'
import { prisma } from '@/db.server'
import { getRandomInt } from '@/utils/helpers'

export async function findUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } })
}

export async function findUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } })
}

export async function registerUser({
  ...data
}: {
  email: User['email']
  firstName: User['firstName']
  lastName: User['lastName']
  password: string
}) {
  const hash = await bcrypt.hash(data.password, 10)
  const username = await generateUsernameFromEmail(data.email)

  return prisma.user.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      username,
      password: {
        create: { hash },
      },
    },
  })
}

export async function createVerificationToken(userId: User['id']) {
  const expDate = addDays(new Date(), 7)
  const randomBytes = crypto.randomBytes(24)
  const token = Buffer.from(randomBytes).toString('hex')

  return prisma.verificationToken.create({
    data: {
      userId: userId,
      expires: expDate,
      token,
    },
  })
}

export async function findVerificationTokenById(id: VerificationToken['id']) {
  return prisma.verificationToken.findUnique({ where: { id } })
}

export async function findVerificationToken(id: VerificationToken['id'], token: VerificationToken['token']) {
  return prisma.verificationToken.findFirst({
    where: { AND: [{ id }, { token }] },
  })
}

export async function verifyUserEmail(token: VerificationToken['token'], id: User['id']) {
  const user = await prisma.user.update({
    data: { emailVerifiedAt: new Date() },
    where: { id },
  })

  await prisma.verificationToken.delete({ where: { token } })

  return user
}

export async function deleteUserByEmail(email: User['email']) {
  return prisma.user.delete({ where: { email } })
}

export async function generateUsernameFromEmail(email: string): Promise<string> {
  const username = email.split('@')[0]
  const isUsernameExists = await prisma.user.findUnique({ where: { username } })
  const generatedUsername = isUsernameExists ? username + getRandomInt() : username

  return generatedUsername
}
