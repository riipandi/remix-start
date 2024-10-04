import type { MetaFunction } from '@remix-run/node'
import * as Lucide from 'lucide-react'
import { Link } from '#/components/link'

export const meta: MetaFunction = () => [{ title: 'Sign in - Remix Start' }]

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mt-6 flex flex-col items-center justify-center px-8 text-center sm:mt-8">
        <h1 className="font-medium text-xl dark:text-white">Forgot your password?</h1>
        <p className="mt-3 text-gray-500 text-sm dark:text-gray-400">
          Don't worry, enter your email address below and we'll send you a link to reset your
          password.
        </p>
      </div>

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
            placeholder="Email address"
            autoComplete="email"
          />
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="w-full transform rounded-lg bg-primary-500 px-6 py-2.5 font-medium text-sm text-white capitalize tracking-wide transition-colors duration-300 hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-50"
          >
            Send reset link
          </button>
        </div>
      </form>

      <div className="mt-10 space-x-1 text-center text-sm dark:text-white">
        <span>Remember your password?</span>
        <Link to="/login" className="hover:underline">
          Back to sign in
        </Link>
      </div>
    </>
  )
}
