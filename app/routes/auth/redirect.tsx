import type { LoaderArgs, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { LOGIN_URL } from '@/modules/sessions/constants.server'
import { authenticator } from '@/modules/users/auth.server'

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: LOGIN_URL,
  })

  // Put custom condition here
  const redirectTo = user ? '/notes' : '/'

  return redirect(redirectTo)
}
