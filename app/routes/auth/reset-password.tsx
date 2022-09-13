import type { ActionArgs, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData, useSearchParams, useSubmit, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { appUrl } from '@/utils/http'
import { authenticator } from '@/modules/users/auth.server'
import { deleteVerificationToken, findVerificationToken, updateUserPassword } from '@/modules/users/user.server'
import { sendPasswordResetEmail } from '@/services/mailer/password-reset.server'
import { SubmitButton } from '@/components/Buttons'
import { AlertDanger } from '@/components/Alerts'

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request)
  if (user) return redirect('/')
  return json({})
}

export async function action({ request }: ActionArgs) {
  const formData: any = await request.formData()

  const verify = await findVerificationToken(formData.get('verifyId'), formData.get('verifyToken'))

  if (!verify) {
    return json({ message: 'Invalid verification token!' }, { status: 400 })
  }

  const loginLink = appUrl(`/auth/signin`)
  const user = await updateUserPassword(verify.userId, formData.get('password'))

  if (!user) {
    return json({ message: 'Failed to reset your password!' }, { status: 400 })
  }

  await sendPasswordResetEmail(user.email, user?.firstName, loginLink)
  await deleteVerificationToken(verify.token)
  //   try {
  //   } catch (error) {
  //     return json({ error: { message: 'Failed to reset your password!' } }, { status: 400 })
  //   }

  return json({ message: 'Your password has been changed!' }, { status: 400 })
}

export const meta: MetaFunction = () => ({ title: 'Reset Password' })

export default function ResetPasswordPage() {
  const transition = useTransition()
  const actionData = useActionData<typeof action>()
  const loaderData = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const verifyId = searchParams.get('id')
  const verifyToken = searchParams.get('token')

  const formSchema = Yup.object().shape({
    password: Yup.string().required('Password is required').min(3, 'Password must be at 3 char long'),
    confirmPassword: Yup.string()
      .required('Password confirmation is required')
      .oneOf([Yup.ref('password')], 'Passwords does not match'),
  })

  const { register, handleSubmit, formState } = useForm({ resolver: yupResolver(formSchema) })
  const { errors } = formState
  const submit = useSubmit()

  const onSubmit = (data: any) => submit(data, { method: 'post' })

  if (!verifyId || !verifyToken) {
    return (
      <main className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
        <div
          className="flex rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <ExclamationTriangleIcon className="mr-3 inline h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Info</span>
          <div>Invalid token!</div>
        </div>
        <div className="mt-4 px-1 text-sm text-gray-500">
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
      {actionData?.message && <AlertDanger title="Information" message={actionData?.message} />}

      <Form method="post" className="space-y-4" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
              {errors.password?.message as string}
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
              {...register('confirmPassword', { required: true })}
              disabled={transition.state === 'submitting'}
              aria-invalid={errors.confirmPassword ? true : undefined}
              aria-describedby="password-confirmation-error"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Confirm your new password"
            />
          </div>
          {errors.confirmPassword && (
            <span className="pt-1 text-red-700 text-xs" id="-confirmation-error">
              {errors.confirmPassword?.message as string}
            </span>
          )}
        </div>

        <div>
          <SubmitButton transition={transition} idleText="Continue" submitText="Processing..." />
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
