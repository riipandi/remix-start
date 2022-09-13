import type { FC } from 'react'
import { XCircleIcon } from '@heroicons/react/20/solid'

interface AlertProps {
  title?: string
  message: string
}

export const AlertDanger: FC<AlertProps> = (props) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {props.title && <h3 className="mb-2 text-sm font-medium text-red-800">{props.title}</h3>}
          <div className="text-sm text-red-700">
            <p>{props.message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
