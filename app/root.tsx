// Import the stylesheet (Tailwind CSS)
import './styles/fontface.css'
import './styles/globals.css'
import './styles/colors.css'

import * as React from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { isRouteErrorResponse } from 'react-router'
import InternalError from '#/components/errors/boundary'
import type { Route } from './+types/root'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
]

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'Something went wrong on our end. Please try again later.'
  let stack: string | undefined
  let statusCode = 500

  if (isRouteErrorResponse(error)) {
    const msgNotFound = 'The requested page could not be found.'
    message = error.status === 404 ? 'Page not found' : 'Something went wrong'
    details = error.status === 404 ? msgNotFound : error.statusText || details
    statusCode = error.status
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
    statusCode = 500
  }

  return <InternalError statusCode={statusCode} details={details} message={message} stack={stack} />
}
