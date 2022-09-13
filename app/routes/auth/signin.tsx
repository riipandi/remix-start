import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node'
import { Form, Link, useTransition, useSearchParams, useLoaderData, useSubmit } from '@remix-run/react'
import { ArrowRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { json, redirect } from '@remix-run/node'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'

import { LOGIN_URL, SESSION_ERROR_KEY } from '@/services/sessions/constants.server'
import { commitSession, getSession, sessionStorage, setCookieExpires } from '@/services/sessions/session.server'
import { authenticator } from '@/modules/users/auth.server'
import { getRedirectTo } from '@/utils/http'
import { AuthLabel, SocialAuth } from '@/components/SocialAuth'

export async function loader({ request }: LoaderArgs) {
  // If the user is already authenticated redirect to /notes directly
  await authenticator.isAuthenticated(request, { successRedirect: '/' })
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  const error = session.get(SESSION_ERROR_KEY)

  return json<any>({ error })
}

export async function action({ request }: ActionArgs) {
  const redirectTo = getRedirectTo(request)

  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  const user = await authenticator.authenticate('user-pass', request, {
    failureRedirect: `${LOGIN_URL}?redirectTo=${redirectTo}`,
  })

  // manually get the session, store the user data, and commit the session
  const session = await getSession(request.headers.get('Cookie'))
  session.set(authenticator.sessionKey, user)

  const headers = new Headers({
    'Set-Cookie': await commitSession(session, {
      expires: setCookieExpires(),
    }),
  })

  return redirect(redirectTo, { headers })
}

export const meta: MetaFunction = () => ({ title: 'Sign In' })

export default function SignInPage() {
  const transition = useTransition()
  const loaderData = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/notes'
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const submit = useSubmit()

  const onSubmit = (data: any) => submit(data, { method: 'post' })

  return (
    <main className="bg-white pt-6 pb-8 px-4 shadow-md sm:rounded-lg sm:px-10">
      <div className="pb-0">
        <div className="mt-4">
          <SocialAuth label={AuthLabel.SIGNIN} />
        </div>
        <div className="relative p-2 mt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-b border-gray-300 border-dashed" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">or continue with</span>
          </div>
        </div>
      </div>

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

      <Form method="post" reloadDocument className="space-y-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <div className="mt-1">
            <input
              type="text"
              autoFocus={true}
              {...register('email', { required: true })}
              disabled={transition.state === 'submitting'}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby="email-error"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          {errors.email && (
            <span className="pt-1 text-red-700 text-xs" id="email-error">
              Email is required
            </span>
          )}
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              {...register('password', { required: true })}
              disabled={transition.state === 'submitting'}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby="password-error"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Password"
            />
          </div>
          {errors.password && (
            <span className="pt-1 text-red-700 text-xs" id="password-error">
              Password is required
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={transition.state === 'submitting'}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember
            </label>
          </div>

          <div className="text-sm">
            <Link
              className="font-medium text-primary-500 hover:text-primary-600"
              to={{
                pathname: '/auth/recovery',
                search: searchParams.toString(),
              }}
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center w-full justify-center">
            <span className="relative inline-flex w-full">
              <button
                type="submit"
                className={clsx(
                  transition.state === 'submitting'
                    ? 'bg-primary-500 hover:bg-primary-400'
                    : 'bg-primary-500 hover:bg-primary-700',
                  'w-full flex items-center justify-center py-2.5 px-4 tracking-wide border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                )}
                disabled={transition.state === 'submitting'}
              >
                {transition.state === 'submitting' ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRightIcon className="h-4 w-4 ml-1 -mr-1" />
                  </>
                )}
              </button>
              {transition.state === 'submitting' && (
                <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 border-primary-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-50 border-primary-500" />
                </span>
              )}
            </span>
          </div>
        </div>
      </Form>

      <div className="mt-8 text-sm text-center text-gray-500">
        Don't have an account?{' '}
        <Link
          className="text-primary-500 font-medium hover:underline"
          to={{
            pathname: '/auth/signup',
            search: searchParams.toString(),
          }}
        >
          Sign up
        </Link>
      </div>
    </main>
  )
}
