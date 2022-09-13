import type { FC } from 'react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'

interface AlertProps {
  title?: string
  message: string
}

export const AlertSuccess: FC<AlertProps> = (props) => {
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {props.title && <h3 className="mb-2 text-sm font-medium text-green-800">{props.title}</h3>}
          <div className="text-sm text-green-700">
            <p>{props.message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
