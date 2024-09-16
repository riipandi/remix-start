import type { LinksFunction, LoaderFunction, MetaDescriptor, MetaFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, json, useRouteError } from '@remix-run/react'
import { ScrollRestoration, isRouteErrorResponse } from '@remix-run/react'
import { type PropsWithChildren, useEffect } from 'react'

import InternalError from '#/components/errors/internal-error'
import NotFound from '#/components/errors/not-found'
import { useNonce } from '#/context/providers/nonce-provider'
import { clx } from '#/utils/ui-helper'

import styles from './styles.css?url'

export const loader: LoaderFunction = async ({ request, context }) => {
  return json({
    // Dynamic Canonical URL: https://sergiodxa.com/tutorials/add-dynamic-canonical-url-to-remix-routes
    meta: [{ tagName: 'link', rel: 'canonical', href: request.url }] satisfies MetaDescriptor[],
    nonce: context.nonce as string,
    baseUrl: process.env.APP_BASE_URL,
  })
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml', sizes: 'any', id: 'favicon-svg' },
  { rel: 'apple-touch-icon', href: '/favicon.png', type: 'image/png', sizes: '256x256' },
  { rel: 'manifest', href: '/site.webmanifest' },
]

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const siteTitle = 'Remix Start'
  const siteDescription = 'Welcome to Remix!'
  return [
    { title: siteTitle },
    { name: 'description', content: siteDescription },
    { name: 'msapplication-TileColor', content: '#3730a3', media: '(prefers-color-scheme: light)' },
    { name: 'msapplication-TileColor', content: '#000d1a', media: '(prefers-color-scheme: dark)' },
    { name: 'theme-color', content: '#3730a3', media: '(prefers-color-scheme: light)' },
    { name: 'theme-color', content: '#000d1a', media: '(prefers-color-scheme: dark)' },
    { name: 'robots', content: 'index, follow' },
    ...(data?.meta ?? []),
  ]
}

export function Layout({ children }: PropsWithChildren) {
  const nonce = useNonce()

  useEffect(() => {
    // Dynamic favicon, changed when dark mode changes or switches to other tab.
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const favicon = document.querySelector('link[rel="icon"][id="favicon-svg"]') as HTMLLinkElement
    const FAVICON_URLS = { LIGHT: '/favicon.ico', DARK: '/favicon.svg', INACTIVE: '/favicon.png' }

    const updateFavicon = () => {
      const isDarkMode = darkModeMediaQuery.matches
      const isHidden = document.hidden

      if (isHidden) {
        favicon?.setAttribute('href', FAVICON_URLS.INACTIVE)
      } else {
        favicon?.setAttribute('href', isDarkMode ? FAVICON_URLS.DARK : FAVICON_URLS.LIGHT)
      }
    }

    const handleDarkModeChange = () => {
      updateFavicon()
    }

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange)
    document.addEventListener('visibilitychange', updateFavicon)

    updateFavicon() // Initial favicon update

    return () => {
      document.removeEventListener('visibilitychange', updateFavicon)
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={clx(import.meta.env.DEV && 'debug-breakpoints')} suppressHydrationWarning>
        <a href="#main" className="skiplink">
          Skip to main content
        </a>
        <div id="main">{children}</div>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const nonce = useNonce()

  const pageTitle = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Something wrong'

  return (
    <html lang="en">
      <head>
        <title>{pageTitle}</title>
        <Meta />
        <Links />
      </head>
      <body className={clx(import.meta.env.DEV && 'debug-breakpoints')} suppressHydrationWarning>
        {isRouteErrorResponse(error) ? (
          <NotFound status={error.status} statusText={error.statusText} />
        ) : error instanceof Error ? (
          <InternalError message={error.message} />
        ) : (
          <h1>Unknown Error</h1>
        )}
        <Scripts nonce={nonce} />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
