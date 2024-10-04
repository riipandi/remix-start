/*!
 * Portions of this file are based on code from `mattstobbs/remix-dark-mode`.
 * Credits to Matt Stobbs: https://github.com/mattstobbs/remix-dark-mode
 */

import { createCookieSessionStorage } from '@remix-run/node'
import { Theme, type ThemeType, isTheme } from '#/context/providers/theme-provider'
import { GlobalCookiesOptions } from '#/utils/env.server'

// Expired in 720 hours / 30 days from now
const cookiesExpiry = new Date(Date.now() + 3600 * 1000 * 720)

export const THEME_COOKIE_KEY = 'remix_start_theme'

/**
 * Creates a session storage for managing theme preferences.
 */
const themeStorage = createCookieSessionStorage({
  cookie: { name: THEME_COOKIE_KEY, ...GlobalCookiesOptions },
})

/**
 * Retrieves and manages the theme session for a given request.
 * @param request - The incoming request object.
 * @returns An object with methods to get, set, and commit the theme.
 */
async function getThemeSession(request: Request) {
  const cookiesHeader = request.headers.get('Cookie')
  const session = await themeStorage.getSession(cookiesHeader)

  return {
    getTheme: () => {
      const themeValue = session.get('theme')
      return isTheme(themeValue) ? themeValue : Theme.SYSTEM
    },
    setTheme: (theme: ThemeType) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session, { expires: cookiesExpiry }),
  }
}

export { getThemeSession }
