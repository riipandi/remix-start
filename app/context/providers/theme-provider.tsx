import { useFetcher, useRevalidator } from '@remix-run/react'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { EnumValues } from '#/utils/common'

const Theme = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const

type ThemeType = EnumValues<typeof Theme>

type ThemeContextType = [ThemeType | null, Dispatch<SetStateAction<ThemeType | null>>]

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const prefersLightMQ = '(prefers-color-scheme: light)'

const getTheme = (): ThemeType => {
  if (typeof window === 'undefined') return Theme.SYSTEM
  return window.matchMedia(prefersLightMQ).matches ? Theme.LIGHT : Theme.DARK
}

interface ThemeProviderProps {
  children: React.ReactNode
  specifiedTheme?: ThemeType
}

function useThemeEffect(theme: ThemeType | null) {
  const { revalidate } = useRevalidator()
  const persistTheme = useFetcher()

  const setThemeClass = useCallback((newTheme: ThemeType) => {
    document.documentElement.classList.remove(Theme.LIGHT, Theme.DARK)
    document.documentElement.classList.add(newTheme)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: render once
  useEffect(() => {
    if (theme) {
      persistTheme.submit({ theme }, { action: 'set-theme', method: 'POST' })
      const resolvedTheme = theme === Theme.SYSTEM ? getTheme() : theme
      setThemeClass(resolvedTheme)
    }
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersLightMQ)
    const handleChange = () => {
      if (theme === Theme.SYSTEM) {
        setThemeClass(getTheme())
      }
      revalidate()
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, revalidate, setThemeClass])
}

function ThemeProvider({ children, specifiedTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeType | null>(() => {
    if (specifiedTheme && Object.values(Theme).includes(specifiedTheme)) {
      return specifiedTheme
    }
    return null
  })

  const mountRun = useRef(false)

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true
      setTheme(specifiedTheme ?? getTheme())
    }
  }, [specifiedTheme])

  useThemeEffect(theme)

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>
}

function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
  const [theme] = useTheme()
  const resolvedTheme = theme === Theme.SYSTEM ? getTheme() : theme
  const colorScheme =
    resolvedTheme === Theme.LIGHT ? 'light' : resolvedTheme === Theme.DARK ? 'dark' : 'light dark'

  const setThemeScript = `
    (function() {
      const theme = ${JSON.stringify(resolvedTheme)};
      const cl = document.documentElement.classList;
      cl.remove('light', 'dark');
      cl.add(theme);
    })();
  `

  return (
    <>
      <meta name="color-scheme" content={ssrTheme ? 'light' : colorScheme} />
      {!ssrTheme && (
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Inline script is necessary for theme initialization
          dangerouslySetInnerHTML={{ __html: setThemeScript }}
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

function isTheme(value: unknown): value is ThemeType {
  return typeof value === 'string' && Object.values(Theme).includes(value as ThemeType)
}

export { Theme, type ThemeType, isTheme, NonFlashOfWrongThemeEls, ThemeProvider, useTheme }
