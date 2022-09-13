import type { ActionArgs, ActionFunction, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData, useSubmit, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { ArrowRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'

import { authenticator } from '@/modules/users/auth.server'
import { deleteVerificationToken, findVerificationToken, updateUserPassword } from '@/modules/users/user.server'
import { sendPasswordResetEmail } from '@/services/mailer/password-reset.server'
import { appUrl } from '@/utils/http'

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request)
  if (user) return redirect('/')

  const url = new URL(request.url)
  const verifyId = url.searchParams.get('id')
  const verifyToken = url.searchParams.get('token')

  if (!verifyId || !verifyToken) {
    return json({ error: { message: 'Verification token required!' } }, { status: 400 })
  }

  const verify = await findVerificationToken(verifyId, verifyToken)

  if (!verify) {
    return json({ error: { message: 'Invalid verification token!' } }, { status: 400 })
  }

  return json({ verifyId: verify.id, verifyToken: verify.token })
}

// TODO: fix actionData null
export async function action({ request }: ActionArgs): Promise<any> {
  const formData: any = await request.formData()

  try {
    const verify = await findVerificationToken(formData.get('verifyId'), formData.get('verifyToken'))

    if (!verify) {
      return json({ error: { message: 'Invalid verification token!' } }, { status: 400 })
    }

    const loginLink = appUrl(`/auth/signin`)
    const user = await updateUserPassword(verify.userId, formData.get('password'))

    if (!user) {
      return json({ error: { message: 'Failed to reset your password!' } }, { status: 400 })
    }

    await sendPasswordResetEmail(user.email, user?.firstName, loginLink)
    await deleteVerificationToken(verify.token)

    return json({ success: { message: 'Your password has been changed!' } }, { status: 200 })
  } catch (error) {
    return json({ error: { message: 'Failed to reset your password!' } }, { status: 400 })
  }
}

export const meta: MetaFunction = () => ({ title: 'Reset Password' })

export default function ResetPasswordPage() {
  const transition = useTransition()
  const actionData = useActionData<typeof action>()
  const loaderData = useLoaderData<typeof loader>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const submit = useSubmit()

  const onSubmit = (data: any) => submit(data, { method: 'post' })

  if (loaderData?.error?.message) {
    return (
      <main className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
        <div
          className="flex rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <ExclamationTriangleIcon className="mr-3 inline h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Info</span>
          <div>{loaderData?.error.message}</div>
        </div>
        <div className="mt-6 text-sm text-center text-gray-500">
          Remember your password?{' '}
          <Link to="/auth/signin" className="text-primary-500 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
      {actionData?.success?.message && (
        <div
          className="mb-4 flex rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <ExclamationTriangleIcon className="mr-3 inline h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Info</span>
          <div>{actionData?.success.message}</div>
        </div>
      )}

      <Form method="post" reloadDocument className="space-y-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="verifyId" value={loaderData.verifyId} />
        <input type="hidden" name="verifyToken" value={loaderData.verifyToken} />
        <div>
          <label htmlFor="password" className="sr-only">
            Enter your new password:
          </label>
          <div className="mt-2">
            <input
              type="password"
              autoFocus={true}
              {...register('password', { required: true })}
              disabled={transition.state === 'submitting'}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby="password-error"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter your new password"
            />
          </div>
          {errors.password && (
            <span className="pt-1 text-red-700 text-xs" id="password-error">
              New password is required
            </span>
          )}
        </div>

        <div>
          <label htmlFor="password-confirmation" className="sr-only">
            Confirm your new password:
          </label>
          <div className="mt-2">
            <input
              type="password"
              autoFocus={true}
              {...register('password_confirmation', { required: true })}
              disabled={transition.state === 'submitting'}
              aria-invalid={errors.password_confirmation ? true : undefined}
              aria-describedby="password-confirmation-error"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Confirm your new password"
            />
          </div>
          {errors.password_confirmation && (
            <span className="pt-1 text-red-700 text-xs" id="-confirmation-error">
              Password confirmation is required
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

      <div className="mt-6 text-sm text-center text-gray-500">
        Remember your password?{' '}
        <Link to="/auth/signin" className="text-primary-500 font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </main>
  )
}
