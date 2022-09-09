import type { CookieOptions } from '@remix-run/server-runtime'
import { createSessionStorage } from '@remix-run/node'
import { prisma } from '@/db.server'

import { epochToUTC, expiresToSeconds, getSessionId } from '@/modules/users/session.server'

export function createDatabaseSessionStorage({ cookie }: { cookie: CookieOptions }) {
  return createSessionStorage({
    cookie,
    async createData(data, expires: any) {
      const id = getSessionId()
      const sessionExp: any = expiresToSeconds(expires)

      await prisma.session.create({
        data: {
          id,
          sessionData: data,
          userId: data.userSession.id,
          userAgent: `Google Chrome`,
          ipAddress: '127.0.0.1',
          expires: sessionExp,
          expiresAt: epochToUTC(sessionExp),
        },
      })

      return id
    },
    async readData(id) {
      try {
        const { sessionData }: any = await prisma.session.findUnique({ where: { id } })
        return sessionData
      } catch (error) {
        return null
      }
    },
    async updateData(id, _data, expires) {
      await prisma.session.update({
        where: { id },
        data: { expires },
      })
    },
    async deleteData(id) {
      await prisma.session.delete({ where: { id } })
    },
  })
}
