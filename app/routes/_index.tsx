import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

import Button from '@/components/Button'

export const meta: MetaFunction = () => {
  return [{ title: 'Remix Start' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function IndexPage() {
  return (
    <div className="mx-auto flex size-full min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      <h1 className="block font-bold text-7xl text-gray-800 sm:text-7xl dark:text-white">
        Welcome to Remix
      </h1>
      <div className="mt-8 text-gray-600 text-lg sm:mt-10 dark:text-gray-300">
        <p className="leading-8">
          Minimal containerized Remix Stack with Tailwind CSS and TypeScript.
        </p>
      </div>
      <div className="mt-8 flex flex-row items-center justify-center gap-4 lg:mt-12">
        <Button variant="primary">
          <Link to="/login">Example Page</Link>
        </Button>
        <Button variant="secondary">
          <Link to="https://github.com/riipandi/remix-start" target="_blank" rel="noreferrer">
            GitHub Repo
          </Link>
        </Button>
        <Button variant="destructive">
          <Link to="https://remix.run/docs" target="_blank" rel="noreferrer">
            Remix Docs
          </Link>
        </Button>
      </div>
    </div>
  )
}
