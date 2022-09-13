import { type FC, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import { DialogTransition } from '@/components/Dialog/DialogTransition'

interface IConfirmDialog {
  children: React.ReactNode
  title: string
  open: boolean
  onClose: () => void
  onConfirm: (e?: any) => Promise<void>
}

export const ConfirmDialog: FC<IConfirmDialog> = (props) => {
  const { children, open, onClose, title, onConfirm } = props
  const cancelButtonRef = useRef(null)

  return (
    <DialogTransition
      isOpen={open}
      initialFocus={cancelButtonRef}
      className="flex h-full items-center justify-center px-6 max-w-lg mx-auto"
    >
      <Dialog.Panel className="relative w-full rounded-lg bg-white p-6 text-left shadow-lg">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
            <ExclamationTriangleIcon className="h-8 w-8 text-primary-600" aria-hidden="true" />
          </div>
          <div className="mt-5 text-center sm:mt-5">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{children}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-flow-row-dense grid-cols-2 gap-3 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            onClick={onClose}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </Dialog.Panel>
    </DialogTransition>
  )
}
