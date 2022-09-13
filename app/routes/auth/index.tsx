import { type LoaderArgs,redirect } from '@remix-run/node'

import { authenticator } from '@/modules/users/auth.server'
import { LOGIN_URL } from '@/services/sessions/constants.server'

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: `${LOGIN_URL}?redirectTo=/notes`,
  })

  return redirect('/')
}
