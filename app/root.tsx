import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from '@remix-run/react'
import { json } from '@remix-run/node'
import { Toaster } from 'react-hot-toast'

import type { AuthSession } from '@/modules/users/auth.server'
import { authenticator } from '@/modules/users/auth.server'
import tailwindStylesheetUrl from '@/styles/tailwind.css'
import { ErrorPage } from '@/components/ErrorPage'

interface LoaderData {
  user: Awaited<AuthSession | null>
}

export async function loader({ request }: LoaderArgs) {
  let user = await authenticator.isAuthenticated(request)

  return json<LoaderData>({ user })
}

export const links: LinksFunction = () => {
  return [
    // { rel: 'manifest', href: '/manifest.json' },
    // { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    // { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.bunny.net' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.bunny.net/css?family=inter:100,200,300,400,500,600,700,800,900',
    },
    { rel: 'stylesheet', href: tailwindStylesheetUrl },
  ]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Prismix',
  viewport: 'width=device-width,initial-scale=1',
  description: 'Minimal containerized Remix Stack with Tailwind CSS, SQLite, and Prisma ORM.',
  'msapplication-TileColor': '#0fa968',
  'theme-color': '#0fa968',
})

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
        <Toaster position="bottom-right" reverseOrder={true} containerClassName="mt-16 text-sm" />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error('ERROR', error)

  return (
    <html className="h-full">
      <head>
        <title>Something wrong!</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <ErrorPage code={500} title="Something wrong" description={`An unexpected error occurred: ${error.message}`} />
        <Scripts />
      </body>
    </html>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return (
      <html className="h-full">
        <head>
          <title>{`${caught.status} ${caught.statusText}`}</title>
          <Meta />
          <Links />
        </head>
        <body className="h-full">
          <ErrorPage
            code={caught.status}
            title="Sorry, we can’t find that page."
            description="Check that you typed the address correctly, or try using our site search to find something specific."
          />
          <Scripts />
        </body>
      </html>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
