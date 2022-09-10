import type { User, SocialAccount } from '@prisma/client'
import { prisma } from '@/db.server'

export async function createOrUpdateSocialConnection(email: User['email'], provider: string, socialAccountData: any) {
  const user = (await prisma.user.findFirst({ where: { email } })) as User
  const userAccount = (await prisma.socialAccount.findFirst({ where: { provider, userId: user.id } })) as SocialAccount

  if (!userAccount) {
    return await prisma.socialAccount.create({
      data: {
        user: { connect: { id: user.id } },
        ...socialAccountData,
      },
    })
  }

  return userAccount
}

export async function createUserFromOAuth(userData: any) {
  return await prisma.user.create({
    data: {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      avatarUrl: userData.imageUrl,
      emailVerifiedAt: new Date(),
      socialAccounts: {
        create: {
          providerAccountId: userData.providerAccountId,
          refreshToken: userData.refreshToken,
          accessToken: userData.accessToken,
          accountType: userData.accountType,
          provider: userData.provider,
        },
      },
    },
  })
}
