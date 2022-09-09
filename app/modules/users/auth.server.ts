// app/services/auth.server.ts
import type { User } from '@prisma/client'
import { Authenticator } from 'remix-auth'
import { sessionStorage } from '@/modules/users/session.server'
import { formStrategy } from '@/modules/users/strategies/form-strategy'

// Create an instance of the authenticator, pass a generic with
// what strategies will return and will store in the session.
export const authenticator = new Authenticator<User | Error | null>(sessionStorage, {
  sessionKey: 'sessionKey', // keep in sync
  sessionErrorKey: 'sessionErrorKey', // keep in sync
  throwOnError: true,
})

// Register the authentication strategies
authenticator.use(formStrategy, 'user-pass')
