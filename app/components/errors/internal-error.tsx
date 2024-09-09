import { Button } from '#/components/base-ui'
import { Link } from '#/components/link'
import { clx } from '#/utils/ui-helper'

interface InternalErrorProps {
  message: string
}

export default function InternalError({ message }: InternalErrorProps) {
  return (
    <div className="mx-auto flex size-full min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <h1 className="block font-extrabold text-3xl text-gray-900 tracking-tight sm:text-4xl dark:text-white">
        Something went wrong :-(
      </h1>
      <div className="mt-6 max-w-2xl rounded-md border border-red-300 bg-red-100 p-6 text-gray-800 tracking-tight sm:mt-10 dark:text-gray-300">
        <h2 className="font-mono font-semibold text-base leading-6">Oops, something went wrong.</h2>
        <p className="mt-2 font-mono text-sm leading-7">{message}</p>
      </div>
      <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-4 lg:mt-14">
        <Button variant="primary" className={clx('flex items-center justify-center gap-2')}>
          <span>Try Again</span>
        </Button>
        <Button variant="secondary" className={clx('flex items-center justify-center gap-2')}>
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
