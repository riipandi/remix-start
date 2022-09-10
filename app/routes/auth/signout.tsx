import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { authenticator } from '@/modules/users/auth.server'
import { LOGIN_URL } from '@/modules/sessions/constants.server'

export async function action({ request }: ActionArgs) {
  await authenticator.logout(request, { redirectTo: LOGIN_URL })
}

export async function loader({ request }: LoaderArgs) {
  await authenticator.logout(request, { redirectTo: LOGIN_URL })
}
