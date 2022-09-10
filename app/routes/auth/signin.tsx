import { useRef } from 'react'
import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node'
import { Form, Link, useTransition, useSearchParams, useLoaderData } from '@remix-run/react'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'

import { commitSession, getSession, sessionStorage, setCookieExpires } from '@/modules/sessions/session.server'
import { authenticator } from '@/modules/users/auth.server'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export async function loader({ request }: LoaderArgs) {
  // If the user is already authenticated redirect to /notes directly
  await authenticator.isAuthenticated(request, { successRedirect: '/' })
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  const error = session.get('userErrSession')

  return json<any>({ error })
}

export async function action({ request }: ActionArgs) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  const user = await authenticator.authenticate('user-pass', request, {
    failureRedirect: `/auth/signin`,
  })

  // manually get the session, store the user data, and commit the session
  const session = await getSession(request.headers.get('Cookie'))
  session.set(authenticator.sessionKey, user)

  const headers = new Headers({
    'Set-Cookie': await commitSession(session, {
      expires: setCookieExpires(),
    }),
  })

  return redirect(`/notes`, { headers })
}

export const meta: MetaFunction = () => ({ title: 'Sign In' })

export default function SignInPage() {
  const transition = useTransition()
  const loaderData = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()

  const redirectTo = searchParams.get('redirectTo') || '/notes'
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        {loaderData?.error && (
          <div
            className="mb-4 flex rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            <ExclamationTriangleIcon className="mr-3 inline h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span className="sr-only">Info</span>
            <div>{loaderData?.error.message}</div>
          </div>
        )}

        <Form method="post" className="space-y-6" autoComplete="off">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div>
            <label htmlFor="email" className="block font-medium text-sm text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                disabled={transition.state === 'submitting'}
                aria-invalid={loaderData?.error?.identity ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {loaderData?.error?.identity && (
                <span className="pt-1 text-red-700" id="identity-error">
                  {loaderData.errors.identity}
                </span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                disabled={transition.state === 'submitting'}
                aria-invalid={loaderData?.error?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {loaderData?.error?.password && (
                <span className="pt-1 text-red-700" id="password-error">
                  {loaderData.errors.password}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-primary-500  py-2 px-4 text-white hover:bg-primary-600 focus:bg-primary-400"
            disabled={transition.state === 'submitting'}
          >
            {transition.state === 'submitting' ? 'Processing...' : 'Continue'}
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link
                className="text-primary-500 underline"
                to={{
                  pathname: '/auth/signup',
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
        <div className="mt-10 sm:mt-12 text-sm text-center">
          <Link to="/">&larr; back to homepage</Link>
        </div>
      </div>
    </div>
  )
}
