import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { logger } from '#/utils/common'
import { getRequestIpAddress } from '#/utils/request.server'

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

    const flyRegion = process.env.FLY_REGION
    const flyMachineId = process.env.FLY_MACHINE_ID
    const flyRequestId = request.headers.get('Fly-Request-Id')
    const serviceId = `${flyRegion}::${flyMachineId}::${flyRequestId}`
    const clientIpAddr = getRequestIpAddress(request)
    const isHostedOnFly = flyRegion && flyMachineId

    const responsePayload = {
      status: '🫡 All is well!',
      id: isHostedOnFly ? serviceId : host,
      ip: clientIpAddr,
    }

    return json(responsePayload, { status: 200, headers: { 'Cache-Control': 'no-store' } })
  } catch (error: unknown) {
    logger.error('healthcheck ❌', { error })
    return new Response('Unhealthy', { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}
