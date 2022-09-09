import invariant from 'tiny-invariant'
import type { CookieOptions } from '@remix-run/server-runtime'
import { createCookie, createCookieSessionStorage } from '@remix-run/node'

import { createDatabaseSessionStorage } from '@/modules/users/databaseSessionStorage'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

const USE_DATABASE_SESSION_STORAGE = false

const sessionCookie: CookieOptions = createCookie('__session', {
  sameSite: 'lax', // this helps with CSRF
  path: '/', // remember to add this so the cookie will work in all routes
  httpOnly: true, // for security reasons, make this cookie http only
  secrets: [`${process.env.SESSION_SECRET}`], // replace this with an actual secret
  secure: process.env.NODE_ENV === 'production', // enable this in prod only
  expires: new Date(Date.now() + 86_400), // session expires in seconds.
  maxAge: 60,
})

export const sessionStorage = USE_DATABASE_SESSION_STORAGE
  ? createDatabaseSessionStorage({ cookie: sessionCookie })
  : createCookieSessionStorage({ cookie: sessionCookie })

export const { getSession, commitSession, destroySession } = sessionStorage
