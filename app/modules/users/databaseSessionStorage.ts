import type { CookieOptions } from '@remix-run/server-runtime'
import { createSessionStorage } from '@remix-run/node'
import { prisma } from '@/db.server'

export function createDatabaseSessionStorage({ cookie }: { cookie: CookieOptions }) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      // `expires` is a Date after which the data should be considered
      // invalid. You could use it to invalidate the data somehow or
      // automatically purge this record from your database.
      const session = await prisma.session.create({
        data: {
          strategy: data.strategy,
          user: {
            connect: {
              id: data.user.id,
            },
          },
          expires,
        },
      })
      return session.id
    },
    async readData(id) {
      const data = await prisma.session.findUnique({ where: { id } })
      return data || null
    },
    async updateData(id, data, expires) {
      await prisma.session.update({
        where: { id },
        data: {
          strategy: data.strategy,
          user: {
            connect: { id: data.user.id },
          },
          expires,
        },
      })
    },
    async deleteData(id) {
      await prisma.session.delete({ where: { id } })
    },
  })
}
