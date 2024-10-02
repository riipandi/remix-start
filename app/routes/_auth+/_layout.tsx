import { Link, Outlet, useLocation } from '@remix-run/react'
import { clx } from '#/utils/ui-helper'

export default function AuthLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex h-screen justify-center">
        <div className="relative hidden bg-center bg-cover bg-no-repeat lg:block lg:w-3/5">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url('/images/cartist-hOGKh5qHNAE-unsplash.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-white dark:via-gray-900/70 dark:to-gray-900" />
          <div className="relative flex h-full items-center px-20">
            <div>
              <h2 className="font-bold text-2xl text-white drop-shadow-[0_0_0.3rem_#ffffff70] sm:text-3xl">
                Remix Start
              </h2>
              <p className="mt-3 max-w-xl text-gray-100">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. In autem ipsa, nulla
                laboriosam dolores, repellendus perferendis libero suscipit nam temporibus molestiae
              </p>
            </div>
          </div>
        </div>
        <div className="relative mx-auto flex w-full max-w-md items-center px-6 lg:w-2/5">
          <main className="w-full max-w-md">
            <div className="mx-auto flex justify-center">
              <img
                src="/favicon.svg"
                className="h-7 w-auto sm:h-10 dark:invert"
                alt="Remix Start"
              />
            </div>

            <div className="mt-8 flex items-center justify-center px-8">
              {[
                { href: '/login', label: 'sign in' },
                { href: '/signup', label: 'sign up' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  to={href}
                  className={clx(
                    pathname === href
                      ? 'border-primary-500 dark:border-primary-400 dark:text-white'
                      : 'border-gray-400 text-gray-800 dark:text-gray-400',
                    'w-1/2 border-b pb-4 text-center font-medium capitalize'
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>

            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
