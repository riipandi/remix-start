import type { FC } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import type { Transition } from '@remix-run/react/dist/transition'
import clsx from 'clsx'

interface SubmitButtonProps {
  transition: Transition
  idleText: string
  submitText: string
}

export const SubmitButton: FC<SubmitButtonProps> = (props) => {
  const { transition, idleText, submitText } = props

  return (
    <div className="flex items-center w-full justify-center">
      <span className="relative inline-flex w-full">
        <button
          type="submit"
          className={clsx(
            transition.state === 'submitting'
              ? 'bg-primary-500 hover:bg-primary-400 disabled:bg-primary-400'
              : 'bg-primary-500 hover:bg-primary-700 disabled:bg-primary-400',
            'w-full flex items-center justify-center py-2.5 px-4 tracking-wide border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
          )}
          disabled={transition.state === 'submitting'}
        >
          {transition.state === 'submitting' ? (
            <span>{submitText}</span>
          ) : (
            <>
              <span>{idleText}</span>
              <ArrowRightIcon className="h-4 w-4 ml-1 -mr-1" />
            </>
          )}
        </button>
        {transition.state === 'submitting' && (
          <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 border-primary-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-50 border-primary-500" />
          </span>
        )}
      </span>
    </div>
  )
}
