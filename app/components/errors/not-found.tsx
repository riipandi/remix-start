import type { ErrorResponse } from '@remix-run/node'
import { useNavigate } from '@remix-run/react'
import * as Lucide from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from '#/components/link'

export default function NotFound({ status, statusText }: Omit<ErrorResponse, 'data'>) {
  const navigate = useNavigate()
  const [hasPreviousPage, setHasPreviousPage] = useState(false)

  useEffect(() => setHasPreviousPage(window.history.length > 1), [])

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-12 lg:flex lg:items-center lg:gap-12">
        <div className="wf-ull lg:w-1/2">
          <p className="font-semibold text-base text-blue-500 dark:text-blue-400">
            {status || '404 error'}
          </p>
          <h1 className="mt-3 font-bold text-3xl text-gray-800 md:text-4xl dark:text-white">
            {statusText || 'Page not found'}
          </h1>
          <p className="mt-4 text-gray-500 text-lg dark:text-gray-400">
            Sorry, the page you are looking for doesn&apos;t exist. <br />
            Here are some helpful links:
          </p>
          <div className="mt-6 flex items-center gap-x-3">
            {hasPreviousPage && (
              <button
                type="button"
                className="flex w-1/2 min-w-36 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-gray-700 text-sm transition-colors duration-200 hover:bg-gray-100 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => navigate(-1)}
              >
                <Lucide.ArrowLeft className="size-5 rtl:rotate-180" strokeWidth={2} />
                <span>Go back</span>
              </button>
            )}
            <Link
              to="/"
              className="w-1/2 min-w-36 shrink-0 rounded-lg bg-blue-500 px-5 py-2 text-sm text-white tracking-wide transition-colors duration-200 hover:bg-blue-600 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Take me home
            </Link>
          </div>
        </div>
        <div className="relative mt-12 w-full lg:mt-0 lg:w-1/2">
          <svg
            className="w-full max-w-lg lg:mx-auto"
            width={514}
            height={164}
            viewBox="0 0 514 164"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx={101} cy={22} r={20} stroke="#667085" strokeWidth={2} />
            <circle cx={101} cy={142} r={20} stroke="#667085" strokeWidth={2} />
            <circle cx={21} cy={102} r={20} stroke="#667085" strokeWidth={2} />
            <circle cx={141} cy={102} r={20} stroke="#667085" strokeWidth={2} />
            <circle cx={193} cy={82} r={20} stroke="#667085" strokeWidth={2} />
            <circle cx={313} cy={82} r={20} stroke="#667085" strokeWidth={2} />
            <circle cx={253} cy={22} r={20} stroke="#667085" strokeWidth={2} />
            <circle cx={253} cy={142} r={20} stroke="#667085" strokeWidth={2} />
            <path
              d="M1 102C1 90.9543 9.9543 82 21 82H141C152.046 82 161 90.9543 161 102C161 113.046 152.046 122 141 122H21C9.9543 122 1 113.046 1 102Z"
              stroke="#667085"
              strokeWidth={2}
            />
            <path
              d="M101 162C89.9543 162 81 153.046 81 142L81 22C81 10.9543 89.9543 2 101 2C112.046 2 121 10.9543 121 22L121 142C121 153.046 112.046 162 101 162Z"
              stroke="#667085"
              strokeWidth={2}
            />
            <path
              d="M7.14214 115.995C-0.668351 108.184 -0.668351 95.5211 7.14214 87.7106L86.7107 8.1421C94.5212 0.331614 107.184 0.331607 114.995 8.14209C122.805 15.9526 122.805 28.6159 114.995 36.4264L35.4264 115.995C27.6159 123.805 14.9526 123.805 7.14214 115.995Z"
              stroke="#667085"
              strokeWidth={2}
            />
            <circle cx={453} cy={22} r={20} stroke="#667085" strokeWidth={2} />
            <circle cx={453} cy={142} r={20} stroke="#667085" strokeWidth={2} />
            <circle cx={373} cy={102} r={20} stroke="#667085" strokeWidth={2} />
            <circle cx={493} cy={102} r={20} stroke="#667085" strokeWidth={2} />
            <path
              d="M353 102C353 90.9543 361.954 82 373 82H493C504.046 82 513 90.9543 513 102C513 113.046 504.046 122 493 122H373C361.954 122 353 113.046 353 102Z"
              stroke="#667085"
              strokeWidth={2}
            />
            <path
              d="M453 162C441.954 162 433 153.046 433 142L433 22C433 10.9543 441.954 2 453 2C464.046 2 473 10.9543 473 22L473 142C473 153.046 464.046 162 453 162Z"
              stroke="#667085"
              strokeWidth={2}
            />
            <path
              d="M359.142 115.995C351.332 108.184 351.332 95.5211 359.142 87.7106L438.711 8.1421C446.521 0.331614 459.184 0.331607 466.995 8.14209C474.805 15.9526 474.805 28.6159 466.995 36.4264L387.426 115.995C379.616 123.805 366.953 123.805 359.142 115.995Z"
              stroke="#667085"
              strokeWidth={2}
            />
            <circle cx={253} cy={82} r={80} stroke="#667085" strokeWidth={2} />
            <circle cx={253} cy={82} r={40} stroke="#667085" strokeWidth={2} />
            <line x1="8.74228e-08" y1={1} x2={513} y2="1.00004" stroke="#667085" strokeWidth={2} />
            <line x1="-8.74228e-08" y1={163} x2={513} y2={163} stroke="#667085" strokeWidth={2} />
          </svg>
        </div>
      </div>
    </section>
  )
}
