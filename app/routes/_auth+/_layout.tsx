import { Link, Outlet, useLocation } from '@remix-run/react'
import { ThemeSwitcher } from '#/components/theme'
import { clx } from '#/utils/ui-helper'

export default function AuthLayout() {
  const { pathname } = useLocation()

  const authLinks = [
    { href: '/login', label: 'sign in' },
    { href: '/signup', label: 'sign up' },
  ]

  const isAuthPage = ['/login', '/signup'].includes(pathname)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4 z-50 flex size-10 items-center justify-center">
        <ThemeSwitcher />
      </div>
      <div className="relative flex h-screen justify-center">
        <div className="relative hidden bg-center bg-cover bg-no-repeat lg:block lg:w-3/5">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url('/images/cartist-hOGKh5qHNAE-unsplash.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/70 to-gray-50 dark:via-gray-900/70 dark:to-gray-900" />
          <div className="relative flex h-full items-center px-20">
            <div className="rounded-xl p-6">
              <h2 className="font-bold text-2xl drop-shadow-[0_0_0.3rem_#ffffff70] sm:text-4xl dark:text-white">
                Remix Start
              </h2>
              <p className="mt-3 max-w-xl font-medium text-gray-700 dark:text-gray-100">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. In autem ipsa, nulla
                laboriosam dolores, repellendus perferendis libero suscipit nam temporibus molestiae
              </p>
            </div>
          </div>
        </div>
        <div className="relative mx-auto flex w-full max-w-md items-center px-6 lg:w-2/5">
          <main className="w-full max-w-md">
            <div className="mx-auto flex justify-center">
              <Link to="/" title="Back to home">
                <img
                  src="/favicon.svg"
                  className="h-12 w-auto sm:h-10 dark:invert"
                  alt="Remix Start"
                />
              </Link>
            </div>

            {isAuthPage && (
              <div className="mt-12 flex items-center justify-center px-8 sm:mt-14">
                {authLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    to={href}
                    className={clx(
                      'w-1/2 border-b pb-4 text-center font-medium capitalize',
                      pathname === href
                        ? 'border-primary-500 text-primary-500 dark:border-primary-400 dark:text-white'
                        : 'border-gray-400 dark:text-gray-400'
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}

            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
