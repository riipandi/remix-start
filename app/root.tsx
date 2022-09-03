import type { LinksFunction, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from '@remix-run/react'
import { json } from '@remix-run/node'

import tailwindStylesheetUrl from './styles/tailwind.css'
import { getUser } from './services/session.server'
import { ErrorPage } from './components/ErrorPage'

export const links: LinksFunction = () => {
  return [
    // { rel: 'manifest', href: '/manifest.json' },
    // { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    // { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'stylesheet', href: tailwindStylesheetUrl },
  ]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Prismix',
  viewport: 'width=device-width,initial-scale=1',
  description: 'Minimal containerized Remix Stack with Tailwind CSS, SQLite, and Prisma ORM.',
})

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  return json({
    user: await getUser(request),
  })
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  return (
    <html className="h-full">
      <head>
        <title>{`${caught.status} ${caught.statusText}`}</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <ErrorPage status={caught.status} statusText={caught.statusText} />
        <Scripts />
      </body>
    </html>
  )
}
