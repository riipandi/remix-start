import type { ActionArgs, ActionFunction, LoaderFunction } from '@remix-run/node'
import type { SocialsProvider } from 'remix-auth-socials'
import { redirect } from '@remix-run/node'

import { LOGIN_URL } from '@/modules/sessions/constants.server'
import { authenticator } from '@/modules/users/auth.server'

export let loader: LoaderFunction = () => redirect(LOGIN_URL)

export const action: ActionFunction = async ({ request, params }: ActionArgs) => {
  const { provider } = params as { provider: SocialsProvider }
  return authenticator.authenticate(provider, request)
}
