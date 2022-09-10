import { authenticator } from '@/modules/users/auth.server'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'

export async function action({ request, context }: ActionArgs) {
  await authenticator.logout(request, { redirectTo: '/auth/signin' })
}

export async function loader({ request }: LoaderArgs) {
  await authenticator.logout(request, { redirectTo: '/auth/signin' })
}
