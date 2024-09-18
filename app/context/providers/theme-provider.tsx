/*!
 * Portions of this file are based on code from `mattstobbs/remix-dark-mode`.
 * Credits to Matt Stobbs: https://github.com/mattstobbs/remix-dark-mode
 */

import { useFetcher, useRevalidator } from '@remix-run/react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { EnumValues } from '#/utils/common'

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>]

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themes: Theme[] = Object.values(Theme)
const prefersLightMQ = '(prefers-color-scheme: light)'
const prefersDarkMQ = '(prefers-color-scheme: dark)'

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return Theme.SYSTEM
  if (window.matchMedia(prefersLightMQ).matches) return Theme.LIGHT
  if (window.matchMedia(prefersDarkMQ).matches) return Theme.DARK
  return Theme.SYSTEM
}

const getThemeFromSystem = (): Theme.LIGHT | Theme.DARK => {
  if (typeof window === 'undefined') return Theme.LIGHT
  return window.matchMedia(prefersLightMQ).matches ? Theme.LIGHT : Theme.DARK
}

interface ThemeProviderProps {
  children: React.ReactNode
  specifiedTheme?: EnumValues<typeof Theme>
}

function ThemeProvider({ children, specifiedTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (specifiedTheme && themes.includes(specifiedTheme)) {
      return specifiedTheme
    }
    return null
  })

  const { revalidate } = useRevalidator()
  const persistTheme = useFetcher()
  const mountRun = useRef(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to render once
  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true
      setTheme(specifiedTheme || getPreferredTheme())
      return
    }
    if (theme) {
      persistTheme.submit({ theme }, { action: 'set-theme', method: 'POST' })
      const resolvedTheme = theme === Theme.SYSTEM ? getThemeFromSystem() : theme
      document.documentElement.classList.remove(Theme.LIGHT, Theme.DARK)
      document.documentElement.classList.add(resolvedTheme)
    }
  }, [theme, specifiedTheme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia(prefersLightMQ)
    const handleChange = () => {
      if (theme === Theme.SYSTEM) {
        const newTheme = getThemeFromSystem()
        document.documentElement.classList.remove(Theme.LIGHT, Theme.DARK)
        document.documentElement.classList.add(newTheme)
      }
      revalidate()
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, revalidate])

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>
}

function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
  const [theme] = useTheme()

  // Client-side theme resolution only
  const resolvedTheme =
    typeof window !== 'undefined' && theme === Theme.SYSTEM ? getThemeFromSystem() : theme

  // Handle color scheme for light/dark
  const colorScheme =
    resolvedTheme === Theme.LIGHT ? 'light' : resolvedTheme === Theme.DARK ? 'dark' : 'light dark'

  return (
    <>
      <meta name="color-scheme" content={ssrTheme ? 'light' : colorScheme} />
      {!ssrTheme && (
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = ${JSON.stringify(resolvedTheme)};
                const cl = document.documentElement.classList;
                cl.remove('light', 'dark');
                cl.add(theme);
              })();
            `,
          }}
        />
      )}
    </>
  )
}

function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themes.includes(value as Theme)
}

export { Theme, isTheme, NonFlashOfWrongThemeEls, ThemeProvider, useTheme }
