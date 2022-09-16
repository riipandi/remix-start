import type { ActionArgs, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useActionData, useLoaderData } from '@remix-run/react'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'

import { authenticator } from '@/modules/users/auth.server'
import { createVerificationToken, findUserByEmail } from '@/modules/users/user.server'
import { sendPasswordRecoveryEmail } from '@/services/mailer/password-recovery.server'
import { SESSION_ERROR_KEY } from '@/services/sessions/constants.server'
import { sessionStorage } from '@/services/sessions/session.server'
import { appUrl } from '@/utils/http'

import { AlertDanger } from '@/components/Alerts'
import { SubmitButton } from '@/components/Buttons'
import { EmailInput } from '@/components/Input'

export const validator = withZod(
  z.object({
    email: z.string().min(1, { message: 'Email is required' }).email('Must be a valid email'),
  }),
)

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  // If the user is already authenticated redirect to the protected page directly.
  await authenticator.isAuthenticated(request, { successRedirect: '/' })

  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  const error = session.get(SESSION_ERROR_KEY)

  return json({ error, defaultValues: { email: '' } })
}

export async function action({ request }: ActionArgs): Promise<any> {
  // Validate the forms before submitted
  const fieldValues = await validator.validate(await request.formData())
  if (fieldValues.error) return validationError(fieldValues.error)

  // Do something with correctly typed values
  const { email } = fieldValues.data

  try {
    const user = await findUserByEmail(email)

    if (!user) {
      return json({ errors: 'User not registered!' })
    }

    const verify = await createVerificationToken(user.id)

    if (!verify) {
      return json({ errors: 'Failed to create verification token!' })
    }

    const recoveryLink = appUrl(`/auth/reset-password?id=${verify.id}&token=${verify.token}`)

    await sendPasswordRecoveryEmail(user.email, user.firstName, recoveryLink)
    return json({ errors: 'An email with instruction was sent!' }, { status: 200 })
  } catch (error) {
    return json({ errors: 'Failed to send password recovery link!' })
  }
}

export const meta: MetaFunction = () => ({ title: 'Password Recovery' })

export default function RecoveryPage() {
  const actionData = useActionData<typeof action>()
  const { defaultValues } = useLoaderData<typeof loader>()

  return (
    <main className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
      {actionData?.errors && <AlertDanger message={actionData?.errors} />}

      <ValidatedForm
        method="post"
        validator={validator}
        defaultValues={defaultValues}
        className="space-y-4"
        autoComplete="off"
        id="recovery-form"
      >
        <div>
          <EmailInput name="email" label="Email address" autoFocus={false} />
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
