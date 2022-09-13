import type { CookieOptions } from '@remix-run/server-runtime'
import { createSessionStorage } from '@remix-run/node'
import { redis } from '@/db.server'

import { expiresToSeconds, getSessionId } from '@/services/sessions/session.server'

export function createUpstashSessionStorage({ cookie }: { cookie: CookieOptions }) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
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
    async updateData(id, data, expires) {
      try {
        const ex = expiresToSeconds(expires)
        await redis.set(id, data, { ex })
      } catch (error) {
        return undefined
      }
    },
    async deleteData(id) {
      try {
        await redis.del(id)
      } catch (error) {
        return undefined
      }
    },
  })
}
