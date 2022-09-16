import type { FC } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useFormContext, useIsSubmitting } from 'remix-validated-form'

interface SubmitButtonProps {
  label: string
  submitLabel: string
}

export const SubmitButton: FC<SubmitButtonProps> = (props) => {
  const { label, submitLabel } = props
  const isSubmitting = useIsSubmitting()
  const { isValid } = useFormContext()
  const disabled = isSubmitting || !isValid

  return (
    <div className="flex items-center w-full justify-center">
      <span className="relative inline-flex w-full">
        <button
          type="submit"
          className={clsx(
            disabled
              ? 'bg-primary-500 hover:bg-primary-400 disabled:bg-primary-400'
              : 'bg-primary-500 hover:bg-primary-700 disabled:bg-primary-400',
            'w-full flex items-center justify-center py-2.5 px-4 tracking-wide border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
          )}
          disabled={disabled}
        >
          {isSubmitting ? (
            <span>{submitLabel}</span>
          ) : (
            <>
              <span>{label}</span>
              <ArrowRightIcon className="h-4 w-4 ml-1 -mr-1" />
            </>
          )}
        </button>
        {isSubmitting && (
          <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 border-primary-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-50 border-primary-500" />
          </span>
        )}
      </span>
    </div>
  )
}
