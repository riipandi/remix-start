import type { FC } from 'react'
import clsx from 'clsx'
import { useField, useIsSubmitting } from 'remix-validated-form'

interface TextAreaProps {
  name: string
  label: string
  autoFocus?: boolean
}

export const TextArea: FC<TextAreaProps> = (props) => {
  const { name, label, autoFocus } = props
  const { error, getInputProps } = useField(name)
  const isSubmitting = useIsSubmitting()

  return (
    <>
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <div className="mt-1">
        <textarea
          rows={8}
          {...getInputProps({ id: name })}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${name}-error`}
          className={clsx(
            isSubmitting
              ? 'focus:ring-gray-500 focus:border-gray-500 bg-gray-100 '
              : 'focus:ring-primary-500 focus:border-primary-500 bg-white',
            'w-full flex-1 rounded-md border border-gray-300 py-2 px-3 placeholder-gray-400 sm:text-sm leading-6',
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
