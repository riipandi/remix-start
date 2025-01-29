import type { Route } from './+types/page'
import { Welcome } from './welcome'

export function meta(_props: Route.MetaArgs) {
  return [{ title: 'Remix Start' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} />
}
