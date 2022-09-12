import type { ActionArgs, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { authenticator } from '@/modules/users/auth.server'
import { LOGIN_URL } from '@/modules/sessions/constants.server'

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const verifyId = url.searchParams.get('id')
  const user = await authenticator.isAuthenticated(request)

  if (user) return redirect('/')
  if (!verifyId) return redirect(LOGIN_URL)

  return json({ verifyId })
}

export async function action({ request }: ActionArgs) {
  const formData: any = await request.formData()
  console.log('VERIFY', formData.get('verifyId'))
  return
}

export const meta: MetaFunction = () => ({ title: 'Verify Email' })

export default function Verify() {
  const { verifyId } = useLoaderData<typeof loader>()

  return (
    <main className="bg-white pt-8 pb-8 px-4 shadow-md sm:rounded-lg sm:px-10">
      <h2 className="text-center font-medium text-gray-800 text-xl">Thanks for signing up! </h2>
      <p className="text-gray-700 text-sm text-center mt-4">
        Before getting started, could you verify your email by clicking on the link we just emailed to you? If you
        didn&rsquo;t receive the email, we will gladly send you another.
      </p>

      <div className="py-6">
        <div className="border-t border-dashed border-gray-300" />
      </div>

      <Form method="post" autoComplete="off">
        <input type="hidden" name="verifyId" value={verifyId} />
        <button
          type="submit"
          className="w-full flex items-center justify-center py-2.5 px-4 tracking-wide border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <span>Resend email verification</span>
          <ArrowRightIcon className="h-4 w-4 ml-1 -mr-1" />
        </button>
      </Form>
    </main>
  )
}
