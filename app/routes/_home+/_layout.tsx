import type { LoaderFunction } from '@remix-run/node'
import { Outlet, json } from '@remix-run/react'
import { ThemeSelector } from '#/components/theme'

export const loader: LoaderFunction = async (_ctx) => {
  return json({})
}

export default function HomeLayout() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <div className="absolute top-4 right-4">
        <ThemeSelector />
      </div>
      <main className="mx-auto flex size-full min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
