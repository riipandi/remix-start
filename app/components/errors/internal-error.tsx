import { useNavigate } from '@remix-run/react'
import * as Lucide from 'lucide-react'
import { Link } from '#/components/link'

interface InternalErrorProps {
  message: string
}

export default function InternalError({ message }: InternalErrorProps) {
  const navigate = useNavigate()

  return (
    <section className="bg-white dark:bg-gray-900 ">
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-12 lg:flex lg:items-center lg:gap-12">
        <div className="wf-ull lg:w-1/2">
          <p className="font-semibold text-base text-blue-500 dark:text-blue-400">Internal Error</p>
          <h1 className="mt-3 font-bold text-3xl text-gray-800 md:text-4xl dark:text-white">
            Oops, something went wrong.
          </h1>
          <p className="mt-4 font-mono text-gray-500 text-sm leading-7 dark:text-gray-400">
            {message}
          </p>
          <div className="mt-6 flex items-center gap-x-3">
            <button
              type="button"
              className="flex w-1/2 min-w-36 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-gray-700 text-sm transition-colors duration-200 hover:bg-gray-100 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => navigate(0)}
            >
              <Lucide.ArrowLeft className="size-5 rtl:rotate-180" strokeWidth={2} />
              <span>Try Again</span>
            </button>
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
            <rect x="10" y="10" width="494" height="144" rx="10" stroke="#667085" strokeWidth={2} />
            <line x1="10" y1="50" x2="504" y2="50" stroke="#667085" strokeWidth={2} />
            <circle cx="35" cy="30" r="5" fill="#667085" />
            <circle cx="55" cy="30" r="5" fill="#667085" />
            <circle cx="75" cy="30" r="5" fill="#667085" />
            <path d="M100 100 L150 100 L125 130 Z" stroke="#667085" strokeWidth={2} />
            <line x1="200" y1="85" x2="450" y2="85" stroke="#667085" strokeWidth={2} />
            <line x1="200" y1="105" x2="400" y2="105" stroke="#667085" strokeWidth={2} />
            <line x1="200" y1="125" x2="350" y2="125" stroke="#667085" strokeWidth={2} />
          </svg>
        </div>
      </div>
    </section>
  )
}
