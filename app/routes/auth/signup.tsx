import type { ActionArgs, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useActionData, useLoaderData, useSearchParams } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'

import { authenticator } from '@/modules/users/auth.server'
import { createVerificationToken, findUserByEmail, registerUser } from '@/modules/users/user.server'
import { sendVerificationEmail } from '@/services/mailer/verification-email.server'
import { SESSION_ERROR_KEY } from '@/services/sessions/constants.server'
import { sessionStorage } from '@/services/sessions/session.server'
import { appUrl } from '@/utils/http'

import { AlertDanger } from '@/components/Alerts'
import { SubmitButton } from '@/components/Buttons'
import { EmailInput, PasswordInput, TextInput } from '@/components/Input'
import { AuthLabel, SocialAuth } from '@/components/SocialAuth'

export const validator = withZod(
  z
    .object({
      firstName: z.string().min(1, { message: 'First name is required' }),
      lastName: z.string().min(1, { message: 'last name is required' }),
      email: z.string().min(1, { message: 'Email is required' }).email('Must be a valid email'),
      password: z.string().min(1, { message: 'Password is required' }),
      passwordConfirmation: z.string().min(1, { message: 'Password confirmation is required' }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords don't match",
      path: ['passwordConfirmation'], // path of error
    }),
)

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
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
  const { email, firstName, lastName, password } = fieldValues.data
  const userExists = await findUserByEmail(email)

  if (userExists) {
    return json({ errors: 'User already registered!' })
  }

  const user = await registerUser({ email, firstName, lastName, password })
  const verify = await createVerificationToken(user.id)
  const verifyLink = appUrl(`/auth/verification?id=${verify.id}&token=${verify.token}`)

  // Send email notification to user.
  await sendVerificationEmail(user.email, user.firstName, verifyLink)

  return redirect(`/auth/verify?id=${verify.id}`)
}

export const meta: MetaFunction = () => ({ title: 'Sign Up' })

export default function SignUp() {
  const [searchParams] = useSearchParams()
  const actionData = useActionData<typeof action>()
  const { defaultValues } = useLoaderData<typeof loader>()
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

      {actionData?.errors && <AlertDanger message={actionData?.errors} />}

      <ValidatedForm
        method="post"
        validator={validator}
        defaultValues={defaultValues}
        className="space-y-4"
        autoComplete="off"
        id="signup-form"
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <TextInput name="firstName" label="First Name" autoFocus={false} />
          </div>

          <div>
            <TextInput name="lastName" label="Last Name" autoFocus={false} />
          </div>
        </div>

        <div>
          <EmailInput name="email" label="Email address" autoFocus={false} />
        </div>

        <div>
          <PasswordInput name="password" label="Password" />
        </div>

        <div>
          <PasswordInput name="passwordConfirmation" label="Password confirmation" />
        </div>

        {/* <div>
          <TextInput name="inviteCode" label="Invite Code" autoFocus={false} />
          <p className="mt-4 px-0.5 text-gray-500 text-sm leading-6">
            You currently need an invite code to sign up.
            <br />
            Don&rsquo;t have invite code?{' '}
            <Link to="/waitlist" className="text-primary-500 font-medium hover:underline">
              Get one here &rarr;
            </Link>
          </p>
        </div> */}

        <div className="py-1">
          <div className="border-t border-dashed border-gray-300" />
        </div>

        <div>
          <SubmitButton label="Continue" submitLabel="Processing..." />
        </div>
      </ValidatedForm>

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
