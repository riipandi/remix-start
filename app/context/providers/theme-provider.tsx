/*!
 * Portions of this file are based on code from `mattstobbs/remix-dark-mode`.
 * Credits to Matt Stobbs: https://github.com/mattstobbs/remix-dark-mode
 */

import { useFetcher } from '@remix-run/react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

const themes: Theme[] = Object.values(Theme)

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>]

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const prefersLightMQ = '(prefers-color-scheme: light)'
const prefersDarkMQ = '(prefers-color-scheme: dark)'

const getPreferredTheme = (): Theme => {
  if (typeof window === 'object') {
    if (window.matchMedia(prefersLightMQ).matches) return Theme.LIGHT
    if (window.matchMedia(prefersDarkMQ).matches) return Theme.DARK
  }
  return Theme.SYSTEM
}

const getThemeFromSystem = (): Theme.LIGHT | Theme.DARK => {
  return window.matchMedia(prefersLightMQ).matches ? Theme.LIGHT : Theme.DARK
}

interface ThemeProviderProps {
  children: React.ReactNode
  specifiedTheme?: Theme
}

function ThemeProvider({ children, specifiedTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (specifiedTheme && themes.includes(specifiedTheme)) {
      return specifiedTheme
    }
    if (typeof window === 'object') {
      return specifiedTheme === Theme.SYSTEM ? getThemeFromSystem() : getPreferredTheme()
    }
    return null
  })

  const persistTheme = useFetcher()
  const mountRun = useRef(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to render once
  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true
      return
    }
    const newTheme = theme === Theme.SYSTEM ? getThemeFromSystem() : theme
    if (newTheme) {
      persistTheme.submit({ theme: newTheme }, { action: 'set-theme', method: 'POST' })
      document.documentElement.classList.remove(Theme.LIGHT, Theme.DARK)
      document.documentElement.classList.add(newTheme)
    }
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersLightMQ)
    const handleChange = () => {
      if (theme === Theme.SYSTEM) {
        const newTheme = getThemeFromSystem()
        setTheme(newTheme)
        document.documentElement.classList.remove(Theme.LIGHT, Theme.DARK)
        document.documentElement.classList.add(newTheme)
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>
}

function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
  const [theme] = useTheme()
  const resolvedTheme = theme === Theme.SYSTEM ? getThemeFromSystem() : theme

  return (
    <>
      <meta
        name="color-scheme"
        content={resolvedTheme === Theme.LIGHT ? 'light dark' : 'dark light'}
      />
      {!ssrTheme && (
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: required for clientThemeCode
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

export { isTheme, NonFlashOfWrongThemeEls, Theme, ThemeProvider, useTheme }
