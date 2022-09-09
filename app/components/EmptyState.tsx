import type { FC } from 'react'
import { DocumentDuplicateIcon, PlusCircleIcon } from '@heroicons/react/24/outline'

interface IEmptyState {
  action: () => void
}

export const EmptyState: FC<IEmptyState> = (props) => {
  return (
    <div className="relative z-10 border-dashed rounded-lg border-2 py-24 flex h-full flex-col items-center justify-center text-center">
      <div>
        <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="my-6 text-sm font-medium text-gray-900">You don&rsquo;t have any items.</h3>
        <div className="mx-auto flex justify-center">
          <button
            type="button"
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={props.action}
          >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>
    </div>
  )
}
