import type { LoaderFunctionArgs } from '@remix-run/node'
import { logger } from '#/utils/common'

export async function loader({ request }: LoaderFunctionArgs) {
  const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  const url = new URL('/', `http://${host}`)

  // TODO: put some real logic here
  // if we can connect to the database and make a simple query
  // and make a HEAD request to ourselves, then we're good.

  try {
    await Promise.all([
      fetch(url.toString(), { method: 'HEAD' }).then((r) => {
        if (!r.ok) return Promise.reject(r)
      }),
    ])
    return new Response('🫡 All is well!')
  } catch (error: unknown) {
    logger('ERROR', 'healthcheck ❌', { error })
    return new Response('🔥 Unhealthy', { status: 500 })
  }
}
