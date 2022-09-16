import type { SocialAccount, User } from '@prisma/client'

import { findUserByEmail } from '@/modules/users/user.server'
import { prisma } from '@/services/db.server'
import { sendWelcomeEmail } from '@/services/mailer/welcome-email.server'
import { appUrl } from '@/utils/http'

export async function createOrUpdateSocialConnection(email: User['email'], provider: string, socialAccount: any) {
  const user = (await prisma.user.findFirst({ where: { email } })) as User
  const userSocialAccount = await prisma.socialAccount.findFirst({ where: { provider, userId: user.id } })
  const userAccount = userSocialAccount as SocialAccount

  if (!userAccount) {
    const newSocialAccount = await prisma.socialAccount.create({
      data: {
        user: { connect: { id: user.id } },
        ...socialAccount,
      },
    })
    return newSocialAccount
  }

  return userAccount
}

export async function createUserFromOAuth(user: any, socialAccount: any) {
  const existUser = await findUserByEmail(user.email)

  if (!existUser) {
    const newUser = await prisma.user.create({ data: { ...user, emailVerifiedAt: new Date() } })
    await createOrUpdateSocialConnection(user.email, socialAccount.provider, socialAccount)

    // Send email notification to user.
    const loginLink = appUrl(`/auth/signin`)
    await sendWelcomeEmail(user.email, user.firstName, loginLink)

    return newUser
  }

  // If user exists but doesn't have a social account, create one.
  await createOrUpdateSocialConnection(user.email, socialAccount.provider, socialAccount)

  return existUser
}
