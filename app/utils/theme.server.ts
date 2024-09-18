/*!
 * Portions of this file are based on code from `mattstobbs/remix-dark-mode`.
 * Credits to Matt Stobbs: https://github.com/mattstobbs/remix-dark-mode
 */

import { type CookieOptions, createCookieSessionStorage } from '@remix-run/node'
import { Theme, isTheme } from '#/context/providers/theme-provider'

/**
 * Determines if the application is running in development mode.
 */
const isDevelopment = process.env.NODE_ENV === 'development'
const expirationTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

/**
 * Configuration options for the theme cookie.
 */
const cookiesOptions: Omit<CookieOptions, 'name' | 'expires'> = {
  path: '/',
  sameSite: 'lax',
  secure: !isDevelopment,
  secrets: !isDevelopment ? [process.env.APP_SECRET_KEY] : undefined,
  httpOnly: true,
}

/**
 * Creates a session storage for managing theme preferences.
 */
const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'remix_start_theme',
    expires: expirationTime,
    ...cookiesOptions,
  },
})

/**
 * Retrieves and manages the theme session for a given request.
 * @param request - The incoming request object.
 * @returns An object with methods to get, set, and commit the theme.
 */
async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'))
  return {
    getTheme: () => {
      const themeValue = session.get('theme')
      return isTheme(themeValue) ? themeValue : Theme.DARK
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session, cookiesOptions),
  }
}

export { getThemeSession }
