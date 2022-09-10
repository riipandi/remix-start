import type { CookieOptions } from '@remix-run/server-runtime'
import { createSessionStorage } from '@remix-run/node'
import { prisma } from '@/db.server'

import { epochToUTC, expiresToSeconds, getSessionId } from '@/modules/sessions/session.server'
import { AuthorizationError } from 'remix-auth'

export function createDatabaseSessionStorage({ cookie }: { cookie: CookieOptions }) {
  return createSessionStorage({
    cookie,
    async createData(data, expires: any) {
      const id = getSessionId()
      const sessionExp: any = expiresToSeconds(expires)
      console.log('DEBUG', data)

      try {
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
      } catch (error) {
        // Because redirects work by throwing a Response, you need to check if the
        // caught error is a response and return it or throw it again
        if (error instanceof Response) return error
        if (error instanceof AuthorizationError) {
          // here the error is related to the authentication process
        }
        // here the error is a generic error that another reason may throw
      }

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
