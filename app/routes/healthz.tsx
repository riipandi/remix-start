import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  const url = new URL('/', `http://${host}`)

  try {
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      // TODO: put some real logic here
      fetch(url.toString(), { method: 'HEAD' }).then((r) => {
        if (!r.ok) return Promise.reject(r)
      }),
    ])
    return new Response('🫡 All is well!')
  } catch (error: unknown) {
    console.error('healthcheck ❌', { error })
    return new Response('🔥 Unhealthy', { status: 500 })
  }
}
