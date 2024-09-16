import { isIP } from 'is-ip'

/**
 * This is the list of headers, in order of preference, that will be used to
 * determine the client's IP address.
 */
const IP_HEADERS = Object.freeze([
  'CF-Connecting-IP', // Cloudflare
  'DO-Connecting-IP' /** Digital ocean app platform */,
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
  'HTTP-X-Forwarded-For',
  'oxygen-buyer-ip' /** Shopify oxygen platform */,
  'Proxy-Client-IP',
  'REMOTE_ADDR',
  'True-Client-Ip', // Akamai and Cloudflare
  'WL-Proxy-Client-IP',
  'X-Client-IP',
  'X-Cluster-Client-IP', // Rackspace LB, Riverbed Stingray
  'X-Forwarded-For', // may contain multiple IP addresses in the format: 'client IP, proxy 1 IP, proxy 2 IP' - we use first one
  'X-Forwarded',
  'X-Real-IP', // Nginx proxy, FastCGI
] as const)

/**
 * Receives a Request or Headers objects.
 * If it's a Request returns the request.headers
 * If it's a Headers returns the object directly.
 */
export function getHeaders(requestOrHeaders: Request | Headers): Headers {
  if (requestOrHeaders instanceof Request) {
    return requestOrHeaders.headers
  }

  return requestOrHeaders
}

function parseForwardedHeader(value: string | null): string | null {
  if (!value) return null
  for (const part of value.split(';')) {
    if (part.startsWith('for=')) return part.slice(4)
  }
  return null
}

/*!
 * Portions of this function are based on code from `sergiodxa/remix-utils`.
 * MIT Licensed, Copyright (c) 2021 Sergio Xalambrí.
 *
 * Credits to Alexandru Bereghici:
 * Source: https://github.com/sergiodxa/remix-utils/blob/main/src/server/get-client-ip-address.ts
 */
export function getRequestIpAddress(requestOrHeaders: Request | Headers): string | null {
  const headers = getHeaders(requestOrHeaders)

  const ipAddress = IP_HEADERS.flatMap((headerName) => {
    const value = headers.get(headerName)
    if (headerName === 'Forwarded') {
      return parseForwardedHeader(value)
    }
    if (!value?.includes(',')) return value
    return value.split(',').map((ip) => ip.trim())
  }).find((ip) => {
    if (ip === null) return false
    return isIP(ip)
  })

  return ipAddress ?? null
}
