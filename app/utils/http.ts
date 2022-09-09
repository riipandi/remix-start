import type { User } from '@prisma/client'

const DEFAULT_REDIRECT = '/'

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

export function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.email === 'string'
}

export function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length > 3 && email.includes('@')
}
