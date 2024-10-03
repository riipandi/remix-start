import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import * as Lucide from 'lucide-react'
import { Link } from '#/components/link'

export const loader: LoaderFunction = async (_ctx) => {
  return json({})
}

export const meta: MetaFunction = () => [{ title: 'Documentation - Remix Start' }]

export default function Page() {
  return (
    <section className="relative px-4 pb-20">
      <div className="relative z-10 mx-auto grid h-full w-full max-w-[90rem] grid-cols-1 items-start gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-4 md:gap-y-8">
        <div className="hidden md:block" />
        <div
          id="content"
          className="prose prose-neutral prose-md sm:prose-lg z-10 max-w-none sm:col-span-2"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl dark:text-white">Lorem Ipsum</h1>
          <article className="prose prose-lg mx-auto max-w-4xl text-base text-gray-950 leading-7 dark:text-white dark:[&>h2]:text-white dark:[&>h3]:text-white">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat:
            </p>
            <ul>
              <li>Duis aute irure dolor in reprehenderit</li>
              <li>Excepteur sint occaecat cupidatat non proident</li>
              <li>Sunt in culpa qui officia deserunt mollit anim id est laborum</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</li>
              <li>Nemo enim ipsam voluptatem quia voluptas sit aspernatur</li>
              <li>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet</li>
              <li>Quis autem vel eum iure reprehenderit qui in ea voluptate velit</li>
              <li>At vero eos et accusamus et iusto odio dignissimos ducimus</li>
            </ul>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat:
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat:
            </p>
          </article>
          <div className="not-prose mt-16 flex justify-start">
            <div className="flex w-min flex-row items-center gap-2 rounded-md border px-3.5 py-2.5 text-neutral-600 dark:border-white/20 dark:text-white/80">
              <p className="mr-2 truncate text-base">Was this page helpful?</p>
              <button
                type="button"
                className="flex flex-row items-center gap-2 rounded-md border px-2 py-1 outline-none transition duration-200 hover:bg-neutral-100 dark:border-white/20 dark:hover:bg-white/10"
                aria-expanded="false"
              >
                <Lucide.ThumbsUp className="size-4" strokeWidth={1.8} />
                <p className="font-semibold text-base">Yes</p>
              </button>
              <button
                type="button"
                className="flex flex-row items-center gap-2 rounded-md border px-2 py-1 outline-none transition duration-200 hover:bg-neutral-100 dark:border-white/20"
                aria-expanded="false"
              >
                <Lucide.ThumbsDown className="size-4" strokeWidth={1.8} />
                <p className="font-semibold text-base">No</p>
              </button>
              <div style={{ position: 'fixed', zIndex: 9999, inset: 16, pointerEvents: 'none' }} />
            </div>
          </div>
          <div className="mt-24 grid grid-cols-2">
            <div>
              <div>
                <p className="mb-1 text-base text-neutral-700 dark:text-gray-400">Prev</p>
                <Link
                  to="#"
                  className="font-semibold text-xl no-underline transition hover:text-gray-600 dark:text-gray-100"
                >
                  Lorem Ipsum
                </Link>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="text-right">
                <p className="mb-1 text-base text-neutral-700 dark:text-gray-400">Next</p>
                <Link
                  to="#"
                  className="font-semibold text-xl no-underline transition hover:text-gray-600 dark:text-gray-100"
                >
                  Ipsum Lorem
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div id="toc" className="hidden" />
      </div>
    </section>
  )
}
