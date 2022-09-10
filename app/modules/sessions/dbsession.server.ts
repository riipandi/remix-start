import type { CookieOptions } from '@remix-run/server-runtime'
import { json, createSessionStorage } from '@remix-run/node'
import { AuthorizationError } from 'remix-auth'
import { prisma } from '@/db.server'

import { epochToUTC, expiresToSeconds, getSessionId } from '@/modules/sessions/session.server'

export function createDatabaseSessionStorage({ cookie }: { cookie: CookieOptions }) {
  return createSessionStorage({
    cookie,
    async createData(data, expires: any) {
      const id = getSessionId()
      const sessionExp = expiresToSeconds(expires)

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

        return id
      } catch (error) {
        // Because redirects work by throwing a Response, you need to check if the
        // caught error is a response and return it or throw it again
        if (error instanceof Response || error instanceof AuthorizationError) {
          return error
        }
        return undefined
      }
    },
    async readData(id) {
      try {
        const { sessionData }: any = await prisma.session.findUnique({ where: { id } })
        return sessionData
      } catch (error) {
        return null
      }
    },
    async updateData(id, _data, expires: any) {
      try {
        const sessionExp: any = expiresToSeconds(expires)
        await prisma.session.update({
          data: { expires: sessionExp, expiresAt: epochToUTC(sessionExp) },
          where: { id },
        })
      } catch (error) {
        return undefined
      }
    },
    async deleteData(id) {
      try {
        await prisma.session.delete({ where: { id } })
      } catch (error) {
        return undefined
      }
    },
  })
}
