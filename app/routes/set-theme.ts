/*!
 * Portions of this file are based on code from `mattstobbs/remix-dark-mode`.
 * Credits to Matt Stobbs: https://github.com/mattstobbs/remix-dark-mode
 */

import { type ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { isTheme } from '#/context/providers/theme-provider'
import { logger } from '#/utils/common'
import { getThemeSession } from '#/utils/theme.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  const themeSession = await getThemeSession(request)
  const requestText = await request.text()
  const form = new URLSearchParams(requestText)
  const theme = form.get('theme')

  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme`,
    })
  }

  themeSession.setTheme(theme)

  const cookiesValue = await themeSession.commit()

  logger.debug('cookiesValue', cookiesValue)

  return json({ success: true }, { headers: { 'Set-Cookie': cookiesValue } })
}

export const loader = () => redirect('/', { status: 404 })
