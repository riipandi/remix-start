import invariant from 'tiny-invariant'
import type { User } from '@prisma/client'

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

export function getRedirectTo(request: Request): string {
  const url = new URL(request.clone().url)
  const redirectToParam = url.searchParams.get('redirectTo')
  return safeRedirect(redirectToParam)
}

export function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.email === 'string'
}

export function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length > 3 && email.includes('@')
}
