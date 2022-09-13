import type { ActionArgs, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Form, Link, useActionData, useSubmit, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { ArrowRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'

import { authenticator } from '@/modules/users/auth.server'
import { createVerificationToken, findUserByEmail } from '@/modules/users/user.server'
import { sendPasswordRecoveryEmail } from '@/services/mailer/password-recovery.server'
import { appUrl } from '@/utils/http'

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request)
  if (user) return redirect('/')
  return json({})
}

export async function action({ request }: ActionArgs) {
  const formData: any = await request.formData()

  try {
    const user = await findUserByEmail(formData.get('email'))

    if (!user) {
      return json({ message: 'User not registered!' }, { status: 400 })
    }

    const verify = await createVerificationToken(user.id)

    if (!verify) {
      return json({ message: 'Failed to create verification token!' }, { status: 400 })
    }

    const recoveryLink = appUrl(`/auth/reset-password?id=${verify.id}&token=${verify.token}`)

    await sendPasswordRecoveryEmail(user.email, user.firstName, recoveryLink)
    return json({ message: 'Email with reset password instruction was sent!' }, { status: 200 })
  } catch (error) {
    return json({ message: 'Failed to send password recovery link!' }, { status: 400 })
  }
}

export const meta: MetaFunction = () => ({ title: 'Password Recovery' })

export default function RecoveryPage() {
  const transition = useTransition()
  const actionData = useActionData<typeof action>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const submit = useSubmit()

  const onSubmit = (data: any) => submit(data, { method: 'post' })

  return (
    <main className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
      {actionData && actionData?.message && (
        <div
          className="mb-4 flex rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <ExclamationTriangleIcon className="mr-3 inline h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Info</span>
          <div>{actionData?.message}</div>
        </div>
      )}

      {actionData && actionData?.message && (
        <div
          className="mb-4 flex rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <ExclamationTriangleIcon className="mr-3 inline h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Info</span>
          <div>{actionData?.message}</div>
        </div>
      )}

      <Form method="post" reloadDocument className="space-y-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="text-gray-500 text-sm font-medium px-1">
            Enter your email to continue:
          </label>
          <div className="mt-2">
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
                    <span>Send instruction</span>
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

      <div className="mt-6 text-sm text-center text-gray-500">
        Remember your password?{' '}
        <Link to="/auth/signin" className="text-primary-500 font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </main>
  )
}
