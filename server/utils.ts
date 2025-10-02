import type { Request } from 'express'
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

export function getRequestIpAddress(request: Request) {
  const headers = request.headers

  for (const header of IP_HEADERS) {
    const value = headers[header.toLowerCase()]
    if (typeof value === 'string') {
      const parts = value.split(/\s*,\s*/g)
      return parts[0] ?? null
    }
  }

  return request.socket?.remoteAddress ?? null
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
