import type { LoaderArgs, LoaderFunction } from '@remix-run/node'
import { LOGIN_URL } from '@/modules/sessions/constants.server'
import { authenticator } from '@/modules/users/auth.server'

export let loader: LoaderFunction = ({ request, params }: LoaderArgs) => {
  const { provider } = params as { provider: string }

  return authenticator.authenticate(provider, request, {
    successRedirect: '/auth/redirect',
    failureRedirect: LOGIN_URL,
  })
}
