import { Authenticator } from 'remix-auth'
import { sessionStorage } from '@/modules/sessions/session.server'
import { formStrategy } from '@/modules/sessions/strategies/form-strategy'

export interface UserSession {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string | null
}

// Create an instance of the authenticator, pass a generic with
// what strategies will return and will store in the session.
export const authenticator = new Authenticator<UserSession | null>(sessionStorage, {
  sessionKey: 'userSession', // keep in sync
  sessionErrorKey: 'userErrSession', // keep in sync
  throwOnError: false,
})

// Register the authentication strategies
authenticator.use(formStrategy, 'user-pass')
