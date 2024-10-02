import type { MetaFunction } from '@remix-run/node'
import * as Lucide from 'lucide-react'
import { Link } from '#/components/link'
import { SocialLogin } from './__social'

export const meta: MetaFunction = () => [{ title: 'Create Account - Remix Start' }]

export default function SignUpPage() {
  return (
    <>
      <form>
        <div className="relative mt-8 flex items-center">
          <span className="absolute">
            <Lucide.User
              className="mx-3 size-5 text-gray-300 dark:text-gray-500"
              strokeWidth={1.8}
            />
          </span>
          <input
            type="text"
            className="block w-full rounded-lg border bg-white px-11 py-2.5 text-gray-700 focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-primary-300"
            placeholder="Username"
          />
        </div>

        <div className="relative mt-4 flex items-center">
          <span className="absolute">
            <Lucide.Mail
              className="mx-3 size-5 text-gray-300 dark:text-gray-500"
              strokeWidth={1.8}
            />
          </span>
          <input
            type="email"
            className="block w-full rounded-lg border bg-white px-11 py-2.5 text-gray-700 focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-primary-300"
            placeholder="Email address"
          />
        </div>
        <div className="relative mt-4 flex items-center">
          <span className="absolute">
            <Lucide.Lock
              className="mx-3 size-5 text-gray-300 dark:text-gray-500"
              strokeWidth={1.8}
            />
          </span>
          <input
            type="password"
            className="block w-full rounded-lg border bg-white px-10 py-2.5 text-gray-700 focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-primary-300"
            placeholder="Password"
          />
        </div>
        <div className="relative mt-4 flex items-center">
          <span className="absolute">
            <Lucide.Lock
              className="mx-3 size-5 text-gray-300 dark:text-gray-500"
              strokeWidth={1.8}
            />
          </span>
          <input
            type="password"
            className="block w-full rounded-lg border bg-white px-10 py-2.5 text-gray-700 focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-primary-300"
            placeholder="Confirm Password"
          />
        </div>

        <label
          htmlFor="dropzone-file"
          className="mx-auto my-6 flex cursor-pointer items-center rounded-lg border-2 border-dashed bg-white px-3 py-2.5 text-center dark:border-gray-600 dark:bg-gray-900"
        >
          <Lucide.Upload className="size-5 text-gray-300 dark:text-gray-500" strokeWidth={1.8} />
          <h2 className="mx-3 text-gray-400">Profile Photo</h2>
          <input id="dropzone-file" type="file" className="hidden" />
        </label>

        <div className="mt-4 flex items-center">
          <div className="flex">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="pointer-events-none mt-0.5 shrink-0 rounded border-gray-200 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-800 dark:checked:border-primary-500 dark:checked:bg-primary-500"
            />
          </div>
          <div className="inline-flex w-full items-center justify-between">
            <div className="ms-2.5">
              <label htmlFor="remember-me" className="text-sm dark:text-white">
                I accept the{' '}
                <Link
                  to="/terms"
                  newTab
                  className="text-primary-600 hover:underline focus:rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-primary-500 dark:hover:text-primary-600"
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="w-full transform rounded-lg bg-primary-500 px-6 py-2.5 font-medium text-sm text-white capitalize tracking-wide transition-colors duration-300 hover:bg-primary-400 focus:outline-none focus:ring focus:ring-primary-300 focus:ring-opacity-50"
          >
            Continue
          </button>
        </div>
      </form>

      <SocialLogin label="Or, sign up with" separatorPlacement="top" />

      <div className="mt-10 text-center">
        <Link to="/" className="text-sm hover:underline dark:text-white">
          Back to homepage
        </Link>
      </div>
    </>
  )
}
