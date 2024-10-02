import { Outlet } from '@remix-run/react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex h-screen justify-center">
        <div
          className="hidden bg-center bg-cover bg-no-repeat lg:block lg:w-3/5"
          style={{ backgroundImage: 'url(/images/cartist-hOGKh5qHNAE-unsplash.jpg)' }}
        >
          <div className="flex h-full items-center bg-gray-900 bg-opacity-40 px-20">
            <div>
              <h2 className="font-bold text-2xl text-white sm:text-3xl">Remix Start</h2>
              <p className="mt-3 max-w-xl text-gray-300 dark:text-gray-100">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. In autem ipsa, nulla
                laboriosam dolores, repellendus perferendis libero suscipit nam temporibus molestiae
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md items-center px-6 lg:w-2/5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
