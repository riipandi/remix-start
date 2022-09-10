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

export async function createUserFromOAuth(data: any) {
  return await prisma.user.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      avatarUrl: data.imageUrl,
      emailVerifiedAt: new Date(),
      socialAccounts: {
        create: {
          providerAccountId: data.providerAccountId,
          refreshToken: data.refreshToken,
          accessToken: data.accessToken,
          accountType: data.accountType,
          expiresAt: data.expiresAt,
          tokenType: data.tokenType,
          provider: data.provider,
        },
      },
    },
  })
}
