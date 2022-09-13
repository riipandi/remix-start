import type { LoaderArgs, LoaderFunction } from '@remix-run/node'

import { authenticator } from '@/modules/users/auth.server'
import { LOGIN_URL } from '@/services/sessions/constants.server'

export let loader: LoaderFunction = ({ request, params }: LoaderArgs) => {
  const { provider } = params as { provider: string }

  return authenticator.authenticate(provider, request, {
    successRedirect: '/auth/redirect',
    failureRedirect: LOGIN_URL,
  })
}
