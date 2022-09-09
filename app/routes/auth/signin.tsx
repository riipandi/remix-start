import { useRef } from 'react'
import type { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Form, Link, useActionData, useTransition, useSearchParams } from '@remix-run/react'

import { authenticator } from '@/modules/users/auth.server'

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/notes',
  })
}

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate('user-pass', request, {
    failureRedirect: '/auth/signin',
    successRedirect: '/notes',
  })
}

export const meta: MetaFunction = () => ({ title: 'Sign In' })

export default function SignInPage() {
  const transition = useTransition()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/notes'
  const actionData = useActionData<typeof action>()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
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
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {/* {actionData?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              )} */}
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
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {/* {actionData?.errors?.password && (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              )} */}
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
