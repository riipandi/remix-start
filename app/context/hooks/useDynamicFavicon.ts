import { useCallback, useEffect } from 'react'

const FAVICON_URLS = {
  LIGHT: '/favicon.svg',
  DARK: '/favicon-white.svg',
  INACTIVE: '/favicon-gray.png',
} as const

export function useDynamicFavicon() {
  const updateFavicon = useCallback(() => {
    const favicon = document.querySelector('link[rel="icon"][id="favicon-svg"]') as HTMLLinkElement
    if (!favicon) return

    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isHidden = document.hidden

    favicon.href = isHidden
      ? FAVICON_URLS.INACTIVE
      : isDarkMode
        ? FAVICON_URLS.DARK
        : FAVICON_URLS.LIGHT
  }, [])

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    darkModeMediaQuery.addEventListener('change', updateFavicon)
    document.addEventListener('visibilitychange', updateFavicon)

    updateFavicon() // Initial favicon update

    return () => {
      document.removeEventListener('visibilitychange', updateFavicon)
      darkModeMediaQuery.removeEventListener('change', updateFavicon)
    }
  }, [updateFavicon])
}
