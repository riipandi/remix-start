import { ArrowRightIcon } from '@heroicons/react/24/outline'
import type { ActionArgs, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useActionData, useLoaderData, useSearchParams } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'

import { authenticator } from '@/modules/users/auth.server'
import {
  deleteVerificationToken,
  findVerificationToken,
  findVerificationTokenByToken,
  updateUserPassword,
} from '@/modules/users/user.server'
import { sendPasswordResetEmail } from '@/services/mailer/password-reset.server'
import { appUrl } from '@/utils/http'

import { AlertDanger } from '@/components/Alerts'
import { SubmitButton } from '@/components/Buttons'
import { PasswordInput } from '@/components/Input'

export const validator = withZod(
  z
    .object({
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

  const url = new URL(request.url)
  const verifyId = url.searchParams.get('id')
  const verifyToken = url.searchParams.get('token')

  if (!verifyId || !verifyToken) return json({ errors: 'Verification token required!' })

  const verify = await findVerificationToken(verifyId, verifyToken)

  if (!verify) return json({ errors: 'Invalid verification token!' })

  if (new Date().getTime() >= verify.expires.getTime()) {
    return json({ errors: 'Verification token has been expired!' })
  }

  return json({ success: true }, { status: 200 })
}

export async function action({ request }: ActionArgs): Promise<any> {
  // Validate the forms before submitted
  const fieldValues = await validator.validate(await request.formData())
  if (fieldValues.error) return validationError(fieldValues.error)

  // Do something with correctly typed values
  const { verifyToken } = fieldValues.submittedData
  console.log(fieldValues.submittedData)
  const { password } = fieldValues.data

  const verify = await findVerificationTokenByToken(verifyToken)

  if (!verify) return json({ errors: 'Invalid verification token!' })

  const loginLink = appUrl(`/auth/signin`)
  const user = await updateUserPassword(verify.userId, password)

  if (!user) return json({ errors: 'Failed to reset your password!' })

  await sendPasswordResetEmail(user.email, user?.firstName, loginLink)
  await deleteVerificationToken(verify.token)

  return redirect('/auth/signin?changed=true')
}

export const meta: MetaFunction = () => ({ title: 'Reset Password' })

export default function ResetPasswordPage() {
  const actionData = useActionData<typeof action>()
  const loaderData = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const verifyId = searchParams.get('id') ?? undefined
  const verifyToken = searchParams.get('token') ?? undefined

  if (!loaderData.success && loaderData.errors) {
    return (
      <main className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
        <AlertDanger message={loaderData?.errors} />
        <div className="py-6">
          <div className="border-t border-dashed border-gray-300" />
        </div>
        <Link
          to="/auth/signin"
          className="w-full flex items-center justify-center py-2.5 px-4 tracking-wide border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <span>Continue sign in</span>
          <ArrowRightIcon className="h-4 w-4 ml-1 -mr-1" />
        </Link>
      </main>
    )
  }

  return (
    <main className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
      {actionData?.errors && <AlertDanger message={actionData?.errors} />}

      <ValidatedForm
        method="post"
        validator={validator}
        defaultValues={loaderData.defaultValues}
        className="space-y-4"
        autoComplete="off"
        id="recovery-form"
      >
        <input type="hidden" name="verifyId" value={verifyId} />
        <input type="hidden" name="verifyToken" value={verifyToken} />
        <div>
          <PasswordInput name="password" label="Enter your new password" />
        </div>

        <div>
          <PasswordInput name="passwordConfirmation" label="Confirm your new password" />
        </div>

        <div className="py-2">
          <div className="border-t border-dashed border-gray-300" />
        </div>

        <div>
          <SubmitButton label="Continue" submitLabel="Processing..." />
        </div>
      </ValidatedForm>

      <div className="mt-6 text-sm text-center text-gray-500">
        Remember your password?{' '}
        <Link to="/auth/signin" className="text-primary-500 font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </main>
  )
}
