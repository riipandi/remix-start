import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useActionData, useLoaderData, useSearchParams } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'

import { authenticator } from '@/modules/users/auth.server'
import { SESSION_ERROR_KEY } from '@/services/sessions/constants.server'
import { commitSession, getSession, sessionStorage, setCookieExpires } from '@/services/sessions/session.server'
import { login } from '@/services/sessions/strategies/form-strategy'

import { AlertDanger, AlertSuccess } from '@/components/Alerts'
import { SubmitButton } from '@/components/Buttons'
import { EmailInput, PasswordInput } from '@/components/Input'
import { AuthLabel, SocialAuth } from '@/components/SocialAuth'

export const validator = withZod(
  z.object({
    email: z.string().min(1, { message: 'Email is required' }).email('Must be a valid email'),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
)

export async function loader({ request }: LoaderArgs) {
  // If the user is already authenticated redirect to the protected page directly.
  await authenticator.isAuthenticated(request, { successRedirect: '/' })
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  const error = session.get(SESSION_ERROR_KEY)

  return json({ error, defaultValues: { email: '', password: '' } })
}

export async function action({ request }: ActionArgs): Promise<any> {
  // Validate the forms before submitted
  const fieldValues = await validator.validate(await request.formData())
  if (fieldValues.error) return validationError(fieldValues.error)

  // Do something with correctly typed values
  const redirectTo = fieldValues.submittedData.redirectTo || '/'
  const { email, password } = fieldValues.data
  const user = await login(email, password)

  if (!user) return json({ errors: 'Invalid credentials!' })
  if (user && !user.emailVerifiedAt) return json({ errors: 'Your email not verified!' })

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
  const [searchParams] = useSearchParams()
  const actionData = useActionData<typeof action>()
  const { defaultValues } = useLoaderData<typeof loader>()
  const redirectTo = searchParams.get('redirectTo') || '/notes'
  const passwordChanged = searchParams.get('changed')

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

      {actionData?.errors && <AlertDanger message={actionData?.errors} />}
      {passwordChanged && <AlertSuccess message="Password has been changed!" />}

      <ValidatedForm
        method="post"
        validator={validator}
        defaultValues={defaultValues}
        className="space-y-4"
        autoComplete="off"
        id="signin-form"
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div>
          <EmailInput name="email" label="Email address" autoFocus={true} />
        </div>
        <div>
          <PasswordInput name="password" label="Password" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
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
          <SubmitButton label="Continue" submitLabel="Processing..." />
        </div>
      </ValidatedForm>

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
