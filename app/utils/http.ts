import invariant from 'tiny-invariant'

const DEFAULT_REDIRECT = '/'

invariant(process.env.APP_URL, 'APP_URL must be set')

export const appUrl = (optionalPath = ''): string => {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000'
  return optionalPath || optionalPath! !== '' ? `${baseUrl}${optionalPath}` : optionalPath
}

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our signin/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== 'string') {
    return defaultRedirect
  }

  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect
  }

  return to
}

export const getDomainUrl = (request: Request) => {
  const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  if (!host) throw new Error('Could not determine domain URL.')

  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export function getRedirectTo(request: Request): string {
  const url = new URL(request.clone().url)
  const redirectToParam = url.searchParams.get('redirectTo')
  return safeRedirect(redirectToParam)
}
