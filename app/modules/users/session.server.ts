import * as crypto from 'crypto'
import invariant from 'tiny-invariant'
import type { CookieOptions } from '@remix-run/server-runtime'
import { createCookie, createCookieSessionStorage } from '@remix-run/node'

import { createDatabaseSessionStorage } from '@/modules/sesions/dbsession.server'
import { createUpstashSessionStorage } from '@/modules/sesions/upstash.server'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')
invariant(process.env.SESSION_STORAGE, 'SESSION_STORAGE must be set')

// Session expiration in seconds.
const SESSION_EXPIRES = 3600

// `expires` is a Date after which the data should be considered
// invalid. You could use it to invalidate the data somehow or
// automatically purge this record from your database.
export const expiresToSeconds = (expires: Date): number => {
  let utcTimeStamp = new Date(expires)
  let epochTime = utcTimeStamp.getTime() / 1000.0

  return Math.floor(epochTime + SESSION_EXPIRES)
}

export function epochToUTC(datetime: number): string {
  const utcTimeStamp = new Date(datetime * 1000)

  return utcTimeStamp.toISOString()
}

// Create a random id - taken from the core `createFileSessionStorage` Remix function.
// Use https://www.epochconverter.com/ to convert epoch to human-readable date.
export const getSessionId = (): string => {
  // Create a random id - taken from the core `createFileSessionStorage` Remix function.
  const randomBytes = crypto.randomBytes(8)
  const id = Buffer.from(randomBytes).toString('hex')
  return id
}

const sessionCookie: CookieOptions = createCookie('__session', {
  sameSite: 'lax', // this helps with CSRF
  path: '/', // remember to add this so the cookie will work in all routes
  httpOnly: true, // for security reasons, make this cookie http only
  secrets: [`${process.env.SESSION_SECRET}`], // replace this with an actual secret
  secure: process.env.NODE_ENV === 'production', // enable this in prod only
  expires: new Date(Date.now() + 86_400), // expires in seconds
  //   maxAge: 60,
})

export const getSessionStorage = () => {
  switch (process.env.SESSION_STORAGE) {
    case 'database':
      return createDatabaseSessionStorage({ cookie: sessionCookie })

    case 'redis':
      return createUpstashSessionStorage({ cookie: sessionCookie })

    default:
      return createCookieSessionStorage({ cookie: sessionCookie })
  }
}

export const sessionStorage = getSessionStorage()

export const { getSession, commitSession, destroySession } = sessionStorage
