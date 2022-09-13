import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import type { FC } from 'react'

interface AlertProps {
  title?: string
  message: string
}

export const AlertWarning: FC<AlertProps> = (props) => {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {props.title && <h3 className="mb-2 text-sm font-medium text-yellow-800">{props.title}</h3>}
          <div className="text-sm text-yellow-700">
            <p>{props.message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
