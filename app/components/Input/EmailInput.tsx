import type { FC } from 'react'
import clsx from 'clsx'
import { useField, useIsSubmitting } from 'remix-validated-form'

interface EmailInputProps {
  name: string
  label: string
  autoFocus?: boolean
}

export const EmailInput: FC<EmailInputProps> = (props) => {
  const { name, label, autoFocus } = props
  const { error, getInputProps } = useField(name)
  const isSubmitting = useIsSubmitting()

  return (
    <>
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <div className="mt-1">
        <input
          type="email"
          {...getInputProps({ id: name })}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${name}-error`}
          className={clsx(
            isSubmitting
              ? 'focus:ring-gray-500 focus:border-gray-500 bg-gray-100 '
              : 'focus:ring-primary-500 focus:border-primary-500 bg-white',
            'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm',
          )}
          placeholder={label}
        />
      </div>
      {error && (
        <span className="p-1 text-red-700 text-xs" id={`${name}-error`}>
          {error}
        </span>
      )}
    </>
  )
}
