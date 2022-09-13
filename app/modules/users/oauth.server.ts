import type { SocialAccount, User } from '@prisma/client'

import { findUserByEmail } from '@/modules/users/user.server'
import { prisma } from '@/services/db.server'

export async function createOrUpdateSocialConnection(email: User['email'], provider: string, socialAccount: any) {
  const user = (await prisma.user.findFirst({ where: { email } })) as User
  const userAccount = (await prisma.socialAccount.findFirst({ where: { provider, userId: user.id } })) as SocialAccount

  if (!userAccount) {
    return await prisma.socialAccount.create({
      data: {
        user: { connect: { id: user.id } },
        ...socialAccount,
      },
    })
  }

  return userAccount
}

export async function createUserFromOAuth(user: any, socialAccount: any) {
  const existUser = await findUserByEmail(user.email)

  if (existUser) {
    // If user exists but doesn't have a social account, create one.
    await createOrUpdateSocialConnection(user.email, socialAccount.provider, socialAccount)
    return existUser
  }

  const newUser = await prisma.user.create({ data: { ...user, emailVerifiedAt: new Date() } })
  const socialConnection = await createOrUpdateSocialConnection(user.email, socialAccount.provider, socialAccount)
  if (!socialConnection) throw new Error('Unable to create social connection.')

  return newUser
}
