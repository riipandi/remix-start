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

export function getRequestIpAddress(request: Request): string | null {
  const headers = request.headers

  for (const header of IP_HEADERS) {
    const value = headers.get(header)
    if (value) {
      const parts = value.split(/\s*,\s*/g)
      return parts[0] ?? null
    }
  }

  return null
}
