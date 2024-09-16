/*!
 * Portions of this file are based on code from `mattstobbs/remix-dark-mode`.
 * Credits to Matt Stobbs: https://github.com/mattstobbs/remix-dark-mode
 */

import { useFetcher } from '@remix-run/react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

/**
 * Enum representing available themes
 */
enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

const themes: Theme[] = Object.values(Theme)

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>]

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const prefersLightMQ = '(prefers-color-scheme: light)'

/**
 * Get the preferred theme based on system preferences
 */
const getPreferredTheme = (): Theme =>
  window.matchMedia(prefersLightMQ).matches ? Theme.LIGHT : Theme.DARK

/**
 * ThemeProvider component to manage theme state
 */
function ThemeProvider({
  children,
  specifiedTheme,
}: {
  children: ReactNode
  specifiedTheme: Theme | null
}) {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (specifiedTheme && themes.includes(specifiedTheme)) {
      return specifiedTheme
    }
    return typeof window === 'object' ? getPreferredTheme() : null
  })

  const persistTheme = useFetcher()
  const mountRun = useRef(false)

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true
      return
    }
    if (theme) {
      persistTheme.submit({ theme }, { action: 'set-theme', method: 'post' })
    }
  }, [theme, persistTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersLightMQ)
    const handleChange = () => setTheme(mediaQuery.matches ? Theme.LIGHT : Theme.DARK)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>
}

// Client-side theme detection and application
const clientThemeCode = `
;(() => {
  const theme = window.matchMedia(${JSON.stringify(prefersLightMQ)}).matches ? 'light' : 'dark';
  const cl = document.documentElement.classList;
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');

  if (themeAlreadyApplied) {
    // this script shouldn't exist if the theme is already applied!
    console.warn("Hi there, could you let Matt know you're seeing this message? Thanks!");
  } else {
    cl.add(theme);
  }

  const meta = document.querySelector('meta[name=color-scheme]');

  if (meta) {
    if (theme === 'dark') {
      meta.content = 'dark light';
    } else if (theme === 'light') {
      meta.content = 'light dark';
    }
  } else {
    console.warn("Hey, could you let Matt know you're seeing this message? Thanks!");
  }
})();
`

/**
 * Component to prevent flash of wrong theme
 */
function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
  const [theme] = useTheme()

  return (
    <>
      <meta name="color-scheme" content={theme === Theme.LIGHT ? 'light dark' : 'dark light'} />
      {!ssrTheme && (
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: required for clientThemeCode
          dangerouslySetInnerHTML={{ __html: clientThemeCode }}
        />
      )}
    </>
  )
}

/**
 * Hook to access the current theme and theme setter
 */
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

/**
 * Type guard to check if a value is a valid Theme
 */
function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themes.includes(value as Theme)
}

export { isTheme, NonFlashOfWrongThemeEls, Theme, ThemeProvider, useTheme }
