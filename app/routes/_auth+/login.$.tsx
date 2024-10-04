import type { MetaFunction } from '@remix-run/node'
import * as Lucide from 'lucide-react'
import { Link } from '#/components/link'
import { SocialLogin } from './__social'

export const meta: MetaFunction = () => [{ title: 'Sign in - Remix Start' }]

export default function SignInPage() {
  return (
    <>
      <form autoComplete="off">
        <div className="relative mt-8 flex items-center">
          <span className="absolute">
            <Lucide.Mail
              className="mx-3 size-5 text-primary-300 dark:text-gray-500"
              strokeWidth={1.8}
            />
          </span>
          <input
            type="email"
            className="block w-full rounded-lg border border-primary-400 bg-white px-11 py-2.5 text-gray-700 placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-primary-300 dark:focus:border-primary-300"
            autoComplete="email"
            placeholder="Email address"
          />
        </div>
        <div className="relative mt-4 flex items-center">
          <span className="absolute">
            <Lucide.Lock
              className="mx-3 size-5 text-primary-300 dark:text-gray-500"
              strokeWidth={1.8}
            />
          </span>
          <input
            type="password"
            className="block w-full rounded-lg border border-primary-400 bg-white px-10 py-2.5 text-gray-700 placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-primary-300 dark:focus:border-primary-300"
            autoComplete="current-password"
            placeholder="Password"
          />
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="w-full transform rounded-lg bg-primary-500 px-6 py-2.5 font-medium text-sm text-white capitalize tracking-wide transition-colors duration-300 hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-50"
          >
            Sign in
          </button>
        </div>
      </form>

      <SocialLogin label="Or, sign in with" separatorPlacement="top" />

      <div className="mt-10 text-center">
        <Link to="/forgot-password" className="text-sm hover:underline dark:text-white">
          Forgot your password?
        </Link>
      </div>
    </>
  )
}
