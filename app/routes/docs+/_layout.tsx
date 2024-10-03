import { type LoaderFunction, json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import * as Lucide from 'lucide-react'
import { useState } from 'react'
import { Link } from '#/components/link'
import { ThemeSwitcher } from '#/components/theme'
import { clx } from '#/utils/ui-helper'

interface DocSection {
  section: string
  pages: Array<{
    title: string
    href?: string
    children?: Array<{
      title: string
      href: string
    }>
  }>
}

export const loader: LoaderFunction = async (_args) => {
  const data: DocSection[] = [
    {
      section: 'Introduction',
      pages: [
        {
          title: 'Welcome',
          href: '/docs/introduction/welcome',
        },
        {
          title: 'Quick Start',
          children: [
            {
              title: 'Sign up for a Remix Start account',
              href: '/docs/introduction/quick-start/create-account',
            },
            {
              title: 'Complete your onboarding',
              href: '/docs/introduction/quick-start/complete-onboarding',
            },
          ],
        },
      ],
    },
    {
      section: 'How To Guides',
      pages: [
        {
          title: 'Integration',
          children: [
            {
              title: 'Integrate with Google Calendar',
              href: '/docs/how-to-guides/integration/google-calendar',
            },
            {
              title: 'Integrate with Notion',
              href: '/docs/how-to-guides/integration/notion',
            },
          ],
        },
        {
          title: 'Quick Action',
          href: '/docs/how-to-guides/quick-action',
        },
      ],
    },
  ]

  return json(data)
}

export default function DocsLayout() {
  const data = useLoaderData<typeof loader>() as DocSection[]
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="relative bg-white dark:bg-gray-950">
      <div className="sticky top-0 z-30">
        <header className="sticky flex items-center px-4 py-6 backdrop-blur">
          <div className="mx-auto h-full w-full max-w-[90rem]">
            <div className="flex h-full flex-row items-center gap-4">
              <div className="flex-none">
                <Link
                  to="/docs"
                  className="group flex flex-row items-center gap-2"
                  aria-label="Remix Start home"
                >
                  <img src="/favicon.svg" className="h-8 dark:invert" alt="Remix Start" />
                </Link>
                <div className="absolute top-[13px] right-2.5 z-20 block md:hidden">
                  <button
                    type="button"
                    className="block cursor-pointer rounded-md p-1.5 outline-none transition hover:bg-black/5"
                    aria-label="Open sidebar"
                  >
                    <Lucide.Menu className="size-6" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
              <div className="block h-9 grow " />
              <div className="hidden h-full flex-none items-center gap-6 md:flex">
                <ThemeSwitcher />
                <Link
                  to="/login"
                  className="not-prose transform select-none overflow-hidden truncate whitespace-nowrap rounded-lg border-0 border-b-0 bg-gray-800 px-5 py-2.5 font-medium text-white uppercase leading-none no-underline outline-sky-500 duration-150 hover:bg-gray-700 focus:outline-2 focus:outline-offset-2"
                >
                  Login
                </Link>
              </div>
              <div className="hidden h-full flex-none items-center sm:hidden">
                <button
                  type="button"
                  className="block cursor-pointer rounded-md p-1.5 outline-none transition hover:bg-black/5"
                  aria-label="Open menu"
                >
                  <Lucide.Menu className="size-6 text-gray-900" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>
      <div className="h-6 bg-white dark:bg-gray-950" />
      <div>
        <div
          className="fixed inset-0 top-[86px] left-[max(16px,calc(50%-45rem))] z-20 hidden md:block"
          style={{ width: 'min(18rem, 25% - 8px)' }}
        >
          <div className="absolute top-6 z-50 w-full pr-4">
            <div className="flex flex-col">
              <div className="group relative flex flex-row items-center gap-4 antialiased">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lucide.Search
                    className="size-5 text-gray-400 group-focus:text-gray-700"
                    strokeWidth={1.8}
                  />
                </div>
                <input
                  type="text"
                  name="Search"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  placeholder="Search"
                  className="block w-full rounded-full border-2 border-gray-200 bg-white/40 py-1.5 pr-8 pl-12 text-base text-gray-700 transition placeholder:text-gray-400 focus:border-gray-700 focus:bg-white focus:text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 mr-4 flex items-center">
                  <span className="mx-0.5 mt-0 mb-0 inline-block select-none font-medium text-gray-400 text-lg antialiased opacity-70">
                    <span className="px-[1px]">⌘</span>
                    <span className="px-[1px]">K</span>
                  </span>
                </div>
              </div>
              <div className="relative z-50 opacity-0">
                <div className="absolute top-2 left-0 z-50 w-full md:top-6 md:right-[-320px] md:w-auto">
                  <div className="z-50 flex flex-col rounded-md border border-gray-200 bg-white p-3 antialiased" />
                </div>
              </div>
            </div>
          </div>
          <div className="hidden-scrollbar h-full overflow-y-auto pt-24 pb-10">
            {data.map((item) => (
              <div key={item.section} className="mb-8">
                <h2 className="mb-3 font-bold text-base text-gray-900 uppercase tracking-tight dark:text-white">
                  {item.section}
                </h2>
                {item.pages.map((page) => (
                  <div key={page.title} className="mb-2">
                    <div
                      className="flex cursor-pointer items-center justify-between"
                      onClick={() => page.children && toggleExpand(page.title)}
                    >
                      {page.href ? (
                        <Link
                          to={page.href}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                          {page.title}
                        </Link>
                      ) : (
                        <span
                          className={clx(
                            expandedItems[page.title]
                              ? 'font-semibold text-gray-900 dark:text-white'
                              : 'text-gray-600 dark:text-gray-300',
                            'hover:text-gray-900 dark:hover:text-white'
                          )}
                        >
                          {page.title}
                        </span>
                      )}
                      {page.children &&
                        (expandedItems[page.title] ? (
                          <Lucide.ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Lucide.ChevronRight className="h-4 w-4 text-gray-500" />
                        ))}
                    </div>
                    {page.children && expandedItems[page.title] && (
                      <ul className="mt-2 space-y-2">
                        {page.children.map((child) => (
                          <li
                            key={child.href}
                            className="border-gray-700 pl-4 hover:border-l-2 hover:pl-3.5"
                          >
                            <Link
                              to={child.href}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Outlet />

        <button
          className="cusor-pointer fixed right-6 bottom-6 z-40 flex flex-row items-center gap-2 rounded-full border bg-black py-2.5 pr-6 pl-5 text-white uppercase outline-none transition hover:bg-gray-800"
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="radix-:r0:"
          data-state="closed"
        >
          <Lucide.Sparkles className="size-5 text-white" strokeWidth={1.8} />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  )
}
