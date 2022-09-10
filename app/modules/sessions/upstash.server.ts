import type { CookieOptions } from '@remix-run/server-runtime'
import { createSessionStorage } from '@remix-run/node'
import { redis } from '@/db.server'

import { expiresToSeconds, getSessionId } from '@/modules/sessions/session.server'

export function createUpstashSessionStorage({ cookie }: { cookie: CookieOptions }) {
  return createSessionStorage({
    cookie,
    async createData(data, expires: any) {
      const id = getSessionId()

      // Call Upstash Redis HTTP API. Set expiration according to the cookie `expired property.
      // Note the use of the `expiresToSeconds` that converts date to seconds.
      const ex = expiresToSeconds(expires)
      await redis.set(id, data, { ex })

      return id
    },
    async readData(id) {
      try {
        return await redis.get(id)
      } catch (error) {
        return null
      }
    },
    async updateData(id, data, expires: any) {
      const ex = expiresToSeconds(expires)
      await redis.set(id, data, { ex })
    },
    async deleteData(id) {
      await redis.del(id)
    },
  })
}
