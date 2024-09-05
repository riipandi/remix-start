import type { LinksFunction, LoaderFunction, MetaDescriptor, MetaFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, json, useRouteError } from '@remix-run/react'
import { ScrollRestoration, isRouteErrorResponse } from '@remix-run/react'
import type { PropsWithChildren } from 'react'

import InternalError from '#/components/errors/internal-error'
import NotFound from '#/components/errors/not-found'
import { clx } from '#/utils/ui-helper'

import { useNonce } from './context/providers/nonce-provider'
import styles from './styles.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const loader: LoaderFunction = async ({ request, context }) => {
  return json({
    // Dynamic Canonical URL: https://sergiodxa.com/tutorials/add-dynamic-canonical-url-to-remix-routes
    meta: [{ tagName: 'link', rel: 'canonical', href: request.url }] satisfies MetaDescriptor[],
    nonce: context.nonce as string,
  })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: 'Remix Start' },
  { name: 'description', content: 'Welcome to Remix!' },
  ...(data?.meta ?? []),
]

export function Layout({ children }: PropsWithChildren) {
  const nonce = useNonce()

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
      <body suppressHydrationWarning>
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
