import { authenticator } from '@/modules/users/auth.server'
import type { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction } from '@remix-run/node'

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: '/auth/signin' })
}

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  await authenticator.logout(request, { redirectTo: '/auth/signin' })
}
