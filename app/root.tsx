import type { LinksFunction, LoaderFunction, MetaDescriptor, MetaFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, json, useLoaderData, useRouteError } from '@remix-run/react'
import { ScrollRestoration, isRouteErrorResponse } from '@remix-run/react'

import InternalError from '#/components/errors/internal-error'
import NotFound from '#/components/errors/not-found'
import { useDynamicFavicon } from '#/context/hooks/useDynamicFavicon'
import { useNonce } from '#/context/providers/nonce-provider'

import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  useTheme,
} from '#/context/providers/theme-provider'
import { getThemeSession } from '#/utils/theme.server'
import { clx } from '#/utils/ui-helper'

import styles from './styles.css?url'

export const loader: LoaderFunction = async ({ request, context }) => {
  const themeSession = await getThemeSession(request)

  return json({
    // Dynamic Canonical URL: https://sergiodxa.com/tutorials/add-dynamic-canonical-url-to-remix-routes
    meta: [{ tagName: 'link', rel: 'canonical', href: request.url }] satisfies MetaDescriptor[],
    nonce: context.nonce as string,
    theme: themeSession.getTheme(),
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

function App() {
  const data = useLoaderData<typeof loader>()
  const [theme] = useTheme()
  const nonce = useNonce()

  useDynamicFavicon()

  return (
    <html lang="en" className={clx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
        <Meta />
        <Links />
      </head>
      <body className={clx(import.meta.env.DEV && 'debug-breakpoints')} suppressHydrationWarning>
        <a href="#main" className="skiplink">
          Skip to main content
        </a>
        <div id="main">
          <Outlet />
        </div>
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

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  )
}
