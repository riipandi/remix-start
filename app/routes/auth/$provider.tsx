import type { ActionArgs, ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { LOGIN_URL } from '@/modules/sessions/constants.server'
import { authenticator } from '@/modules/users/auth.server'

type ParamsType = {
  provider: 'google' | 'spotify'
}

export let loader: LoaderFunction = () => redirect(LOGIN_URL)

export const action: ActionFunction = async ({ request, params }: ActionArgs) => {
  const { provider } = params as ParamsType
  return authenticator.authenticate(provider, request)
}
