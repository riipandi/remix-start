import type { ErrorResponse } from '@remix-run/node'
import * as Lucide from 'lucide-react'
import { Link } from '#/components/link'

export default function NotFound({ status, statusText }: Omit<ErrorResponse, 'data'>) {
  return (
    <div className="mx-auto flex size-full min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      <h1 className="block font-bold text-7xl text-gray-800 sm:text-8xl dark:text-white">
        {status}
      </h1>
      <div className="mt-8 space-y-4 text-gray-600 text-lg sm:mt-10 dark:text-gray-300">
        <p className="leading-8">Oops, something went wrong.</p>
        <p className="leading-8">{statusText}</p>
      </div>
      <div className="mt-8 flex flex-col items-center justify-center lg:mt-14">
        <Link
          to="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent px-3 py-2 font-semibold text-primary-500 ring-offset-white transition-all hover:text-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto dark:ring-offset-gray-900"
        >
          <Lucide.ArrowLeft className="size-5" strokeWidth={2} />
          <span>Back to main page</span>
        </Link>
      </div>
    </div>
  )
}
