import { Authenticator } from 'remix-auth'
import { sessionStorage } from '@/modules/sessions/session.server'
import { formStrategy } from '@/modules/sessions/strategies/form-strategy'
import { SESSION_ERROR_KEY, SESSION_KEY } from '@/modules/sessions/constants.server'

import { googleStrategy } from '@/modules/sessions/strategies/google-strategy'
// import { spotifyStrategy } from '@/modules/sessions/strategies/spotify-strategy'

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
  sessionKey: SESSION_KEY, // keep in sync
  sessionErrorKey: SESSION_ERROR_KEY, // keep in sync
  throwOnError: false,
})

// Register the authentication strategies
authenticator.use(formStrategy, 'user-pass')
authenticator.use(googleStrategy)
// authenticator.use(spotifyStrategy)
