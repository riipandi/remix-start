import type { FC } from 'react'
import { Link } from '@remix-run/react'

interface IErrorPage {
  code: number
  title: string
  description: string
}

export const ErrorPage: FC<IErrorPage> = ({ code, title, description }) => {
  return (
    <div className="flex min-h-full flex-col bg-white pt-16 pb-12">
      <main className="mx-auto flex w-full max-w-4xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-semibold text-primary-600">{code}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">{title}</h1>
            <div className="mt-4 max-w-3xl mx-auto">
              <p className="text-base text-gray-500">{description}</p>
            </div>
            <div className="mt-10 flex space-x-3 items-center justify-center">
              <Link
                to="/"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
              >
                Go back home
              </Link>
              <Link
                to="/support"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-100 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="mx-auto w-full max-w-7xl flex-shrink-0 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-4">
          <Link to="/status" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Status
          </Link>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <Link to="/twitter" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Twitter
          </Link>
        </nav>
      </footer>
    </div>
  )
}
