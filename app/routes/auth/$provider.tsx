import type { ActionArgs, ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { authenticator } from '@/modules/users/auth.server'
import { LOGIN_URL } from '@/services/sessions/constants.server'

type ParamsType = {
  provider: 'google' | 'spotify'
}

export let loader: LoaderFunction = () => redirect(LOGIN_URL)

export const action: ActionFunction = async ({ request, params }: ActionArgs) => {
  const { provider } = params as ParamsType
  return authenticator.authenticate(provider, request)
}
