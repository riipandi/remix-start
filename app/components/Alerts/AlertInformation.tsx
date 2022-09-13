import type { FC } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

interface AlertProps {
  title?: string
  message: string
}

export const AlertInformation: FC<AlertProps> = (props) => {
  return (
    <div className="rounded-md bg-sky-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-sky-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {props.title && <h3 className="mb-2 text-sm font-medium text-sky-800">{props.title}</h3>}
          <div className="text-sm text-sky-700">
            <p>{props.message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
