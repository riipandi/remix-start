import { Link } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/node'

import { LOGIN_URL } from '@/modules/sessions/constants.server'
import { useOptionalUser } from '@/hooks/useOptionalUser'

export const meta: MetaFunction = () => ({ title: 'Home - Prismix' })

export default function Index() {
  const user = useOptionalUser()

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <div className="inset-0 absolute bg-gradient-to-r from-primary-500 via-green-500 to-teal-400 mix-blend-multiply" />
            </div>
            <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-white drop-shadow-md">Prismix</span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
                Check the README.md file for instructions on how to get this project deployed.
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/notes"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-primary-700 shadow-sm hover:bg-primary-50 sm:px-8"
                  >
                    View Notes for {`${user.firstName} ${user.lastName}`}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/auth/signup"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-primary-700 shadow-sm hover:bg-primary-50 sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to={LOGIN_URL}
                      className="flex items-center justify-center rounded-md bg-primary-500 px-4 py-3 font-medium text-white hover:bg-primary-600  "
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
              <a href="https://remix.run">
                <img
                  src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                  alt="Remix"
                  className="mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8">
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {[
              {
                src: 'https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg',
                alt: 'Fly.io',
                href: 'https://fly.io',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157764395-137ec949-382c-43bd-a3c0-0cb8cb22e22d.svg',
                alt: 'SQLite',
                href: 'https://sqlite.org',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg',
                alt: 'Prisma',
                href: 'https://prisma.io',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg',
                alt: 'Tailwind',
                href: 'https://tailwindcss.com',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg',
                alt: 'Prettier',
                href: 'https://prettier.io',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg',
                alt: 'ESLint',
                href: 'https://eslint.org',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg',
                alt: 'TypeScript',
                href: 'https://typescriptlang.org',
              },
            ].map((img) => (
              <a
                key={img.href}
                href={img.href}
                className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
              >
                <img alt={img.alt} src={img.src} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
