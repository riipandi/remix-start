import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import type { ActionArgs, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams, useTransition } from '@remix-run/react'

import { authenticator } from '@/modules/users/auth.server'
import { createVerificationToken, findUserByEmail, registerUser } from '@/modules/users/user.server'
import { sendVerificationEmail } from '@/services/mailer/verification-email.server'
import { appUrl } from '@/utils/http'

import { SubmitButton } from '@/components/Buttons'
import { AuthLabel, SocialAuth } from '@/components/SocialAuth'

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request)
  if (user) return redirect('/')
  return json({})
}

export async function action({ request }: ActionArgs) {
  const formData: any = await request.formData()
  const userExists = await findUserByEmail(formData.get('email'))

  if (userExists) {
    return json({ message: 'User already registered!' }, { status: 400 })
  }

  const user = await registerUser({
    email: formData.get('email'),
    firstName: formData.get('firstname'),
    lastName: formData.get('lastname'),
    password: formData.get('password'),
  })

  const verify = await createVerificationToken(user.id)
  const verifyLink = appUrl(`/auth/verification?id=${verify.id}&token=${verify.token}`)

  // Send email notification to user.
  await sendVerificationEmail(user.email, user.firstName, verifyLink)

  return redirect(`/auth/verify?id=${verify.id}`)
}

export const meta: MetaFunction = () => ({ title: 'Sign Up' })

export default function SignUp() {
  const transition = useTransition()
  const [searchParams] = useSearchParams()
  const actionData = useActionData<typeof action>()
  const redirectTo = searchParams.get('redirectTo') ?? undefined

  return (
    <main className="bg-white pt-6 pb-8 px-4 shadow-md sm:rounded-lg sm:px-10">
      <div className="pb-0">
        <div className="mt-4">
          <SocialAuth label={AuthLabel.SIGNUP} />
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

      <div className="hidden relative -mt-5 -mb-3 p-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-b border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-gray-500">or signup with</span>
        </div>
      </div>

      {actionData?.message && (
        <div
          className="mb-4 flex rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <ExclamationTriangleIcon className="mr-3 inline h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Info</span>
          <div>{actionData?.message}</div>
        </div>
      )}

      <Form method="post" className="space-y-4" autoComplete="off">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstname" className="sr-only">
              First name
            </label>
            <div className="mt-1">
              <input
                type="text"
                autoFocus={true}
                {...register('firstname', { required: true })}
                disabled={transition.state === 'submitting'}
                aria-invalid={errors.firstname ? true : undefined}
                aria-describedby="firstname-error"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="First name"
              />
            </div>
            {errors.firstname && (
              <span className="pt-1 text-red-700 text-xs" id="firstname-error">
                First name is required
              </span>
            )}
          </div>

          <div>
            <label htmlFor="lastname" className="sr-only">
              Last name
            </label>
            <div className="mt-1">
              <input
                type="text"
                {...register('lastname', { required: true })}
                disabled={transition.state === 'submitting'}
                aria-invalid={errors.lastname ? true : undefined}
                aria-describedby="lastname-error"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Last name"
              />
            </div>
            {errors.lastname && (
              <span className="pt-1 text-red-700 text-xs" id="lastname-error">
                Last name is required
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <div className="mt-1">
            <input
              type="text"
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

        <div>
          <label htmlFor="password-confirmation" className="sr-only">
            Password Confirmation
          </label>
          <div className="mt-1">
            <input
              type="password"
              {...register('passwordConfirmation', { required: true })}
              disabled={transition.state === 'submitting'}
              aria-invalid={errors.passwordConfirmation ? true : undefined}
              aria-describedby="password-confirmation-error"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Confirm password"
            />
          </div>
          {errors.passwordConfirmation && (
            <span className="pt-1 text-red-700 text-xs" id="password-confirmation-error">
              Password confirmation is required
            </span>
          )}
        </div>

        {/* <div>
          <label htmlFor="invitecode" className="sr-only">
            Invite Code
          </label>
          <div className="mt-1">
            <input
              type="text"
              {...register('invitecode', { required: true })}
              disabled={transition.state === 'submitting'}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby="invitecode-error"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Invite code"
            />
          </div>
          {errors.invitecode && (
            <span className="pt-1 text-red-700 text-xs" id="invitecode-error">
              Email is required
            </span>
          )}
        </div>

        <p className="mt-4 px-0.5 text-gray-500 text-sm leading-6">
          You currently need an invite code to sign up.
          <br />
          Don&rsquo;t have invite code?{' '}
          <Link to="/waitlist" className="text-primary-500 font-medium hover:underline">
            Get one here &rarr;
          </Link>
        </p> */}

        <div className="py-1">
          <div className="border-t border-dashed border-gray-300" />
        </div>

        <div>
          <SubmitButton transition={transition} idleText="Continue" submitText="Processing..." />
        </div>
      </Form>
      <div className="mt-8 text-sm text-center text-gray-500">
        Already have an account?{' '}
        <Link
          className="text-primary-500 font-medium hover:underline"
          to={{
            pathname: '/auth/signin',
            search: searchParams.toString(),
          }}
        >
          Sign in
        </Link>
      </div>
    </main>
  )
}
