import { Outlet } from '@remix-run/react'

export default function AuthLayout() {
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
          <Outlet />
        </div>
      </div>
    </div>
  )
}
