import os from 'node:os'
import {
  cspConnectSource,
  cspFontSource,
  cspFrameSource,
  cspImgSources,
  cspScriptSource,
} from './constants.js'

const IP_HEADERS = [
  'CF-Connecting-IP', // Cloudflare
  'Fastly-Client-Ip', // Fastly CDN and Firebase hosting header when forwared to a cloud function
  'Fly-Client-IP', // Fly.io
  'Forwarded-For',
  'Forwarded',
  'HTTP_CLIENT_IP',
  'HTTP_FLY_CLIENT_IP', // Fly.io
  'HTTP_FORWARDED_FOR',
  'HTTP_FORWARDED',
  'HTTP_VIA',
  'HTTP_X_CLUSTER_CLIENT_IP',
  'HTTP_X_FORWARDED_FOR',
  'HTTP_X_FORWARDED',
  'Proxy-Client-IP',
  'REMOTE_ADDR',
  'True-Client-Ip', // Akamai and Cloudflare
  'WL-Proxy-Client-IP',
  'X-Client-IP',
  'X-Cluster-Client-IP', // Rackspace LB, Riverbed Stingray
  'X-Forwarded-For', // may contain multiple IP addresses in the format: 'client IP, proxy 1 IP, proxy 2 IP' - we use first one
  'X-Forwarded',
  'X-Real-IP', // Nginx proxy, FastCGI
  // you can add more matching headers here ...
]

export function getRequestIpAddress(request) {
  const headers = request.headers

  for (const header of IP_HEADERS) {
    const value = headers[header]
    if (value) {
      const parts = value.split(/\s*,\s*/g)
      return parts[0] ?? null
    }
  }

  const client = request.connection ?? request.socket ?? request.info

  if (client) {
    return client.remoteAddress ?? null
  }

  return null
}

export function preferHeader(request, from, to) {
  const preferredValue = request.get(from.toLowerCase())
  if (preferredValue == null) return

  delete request.headers[to]
  request.headers[to.toLowerCase()] = preferredValue
}

export function parseNumber(raw) {
  if (raw === undefined) return undefined
  const maybe = Number(raw)
  if (Number.isNaN(maybe)) return undefined
  return maybe
}

export function parseIntAsBoolean(value) {
  return !!Number.parseInt(value, 10)
}

export function getLocalIpAddress() {
  return Object.values(os.networkInterfaces())
    .flat()
    .find((ip) => ip?.family === 'IPv4' && !ip.internal)?.address
}

export async function purgeRequireCache(buildDir) {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  const { createRequire } = await import('node:module')
  const require = createRequire(import.meta.url)

  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(buildDir)) {
      delete require.cache[key]
    }
  }
}

export function getLoadContext(_req, res) {
  return {
    nonce: res.locals.nonce,
  }
}

export function generateCspDirectives() {
  const connectSource =
    process.env.NODE_ENV === 'development' ? ['ws://localhost:*'] : cspConnectSource

  // 'unsafe-eval' required for DOMPurify
  const scriptSrc = [
    "'self'",
    "'report-sample'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    ...cspScriptSource,
  ]

  // @see: https://clerk.com/docs/security/clerk-csp
  // FIXME - this is a hack to get the CSP working in production
  // `unsafe-inline` allows the <LiveReload /> component to load without a nonce in the error pages
  if (process.env.NODE_ENV !== 'development') {
    // Remove unsafe-inline and add a nonce to the script-src in production
    // scriptSrc.splice(scriptSrc.indexOf("'unsafe-inline'"), 1)
    // scriptSrc.splice(scriptSrc.indexOf("'unsafe-eval'"), 1)
    // scriptSrc.push((_req, res) => `'nonce-${res.locals.nonce}'`)
  }

  return {
    'base-uri': ["'self'"],
    'child-src': ["'self'"],
    'connect-src': ["'self'", ...connectSource],
    'default-src': ["'self'"],
    'font-src': ["'self'", ...cspFontSource],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'frame-src': ["'self'", ...cspFrameSource],
    'img-src': ["'self'", 'data:', ...cspImgSources],
    'manifest-src': ["'self'"],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'script-src': [...scriptSrc],
    'style-src': ["'self'", "'report-sample'", "'unsafe-inline'"],
    'worker-src': ["'self'", 'blob:'],
  }
}
