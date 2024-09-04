import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaDescriptor,
  MetaFunction,
} from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useRouteError,
} from '@remix-run/react'
import type { PropsWithChildren } from 'react'

import { InternalError, NotFound } from '#/components/errors'
import { cn } from '#/utils/ui-helper'

import styles from './styles.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    // Dynamic Canonical URL: https://sergiodxa.com/tutorials/add-dynamic-canonical-url-to-remix-routes
    meta: [{ tagName: 'link', rel: 'canonical', href: request.url }] satisfies MetaDescriptor[],
  })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: 'Remix Start' },
    { name: 'description', content: 'Welcome to Remix!' },
    ...(data?.meta ?? []),
  ]
}

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={cn(import.meta.env.DEV && 'debug-screen')} suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
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
      <body>
        <h1>
          {isRouteErrorResponse(error) ? (
            <NotFound status={error.status} statusText={error.statusText} />
          ) : error instanceof Error ? (
            <InternalError message={error.message} />
          ) : (
            'Unknown Error'
          )}
        </h1>
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
