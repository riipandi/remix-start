import { ArrowRightIcon } from '@heroicons/react/24/outline'
import type { LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { authenticator } from '@/modules/users/auth.server'
import { findVerificationToken, verifyUserEmail } from '@/modules/users/user.server'

import { AlertDanger } from '@/components/Alerts'

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

  await verifyUserEmail(verifyToken, verify.userId)

  return json({ success: true }, { status: 200 })
}

export const meta: MetaFunction = () => ({ title: 'Verify Email' })

export default function Verify() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <main className="bg-white pt-8 pb-8 px-4 shadow-md sm:rounded-lg sm:px-10">
      {loaderData?.errors ? (
        <AlertDanger message={loaderData?.errors} />
      ) : (
        <div>
          <h2 className="text-center font-medium text-gray-800 text-xl">Your email verified! </h2>
          <p className="text-gray-700 text-sm text-center mt-4">Thanks for confirming, your account is ready.</p>
          <div className="py-6">
            <div className="border-t border-dashed border-gray-300" />
          </div>
        </div>
      )}

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
