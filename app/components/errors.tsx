import { ErrorResponse } from '@remix-run/node';
import { Link } from '@remix-run/react';

export function NotFound({ status, statusText }: Omit<ErrorResponse, 'data'>) {
  return (
    <div className='mx-auto flex size-full min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8'>
      <h1 className='block text-7xl font-bold text-gray-800 dark:text-white sm:text-8xl'>
        {status}
      </h1>
      <div className='mt-8 text-lg text-gray-600 dark:text-gray-400 sm:mt-10'>
        <p className='leading-8'>Oops, something went wrong.</p>
        <p className='leading-8'>{statusText}</p>
      </div>
      <div className='mt-8 flex flex-col items-center justify-center lg:mt-14'>
        <a
          href='/'
          className='inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm
              font-semibold text-primary-500 ring-offset-white transition-all hover:text-primary-700 focus:outline-none focus:ring-1
              focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-gray-900 sm:w-auto'
        >
          <svg className='size-2.5' width='{20}' height='{20}' viewBox='0 0 16 16' fill='none'>
            <path
              d='M11.2792 1.64001L5.63273 7.28646C5.43747 7.48172 5.43747 7.79831 5.63273 7.99357L11.2792 13.64'
              stroke='currentColor'
              strokeWidth='{2}'
              strokeLinecap='round'
            />
          </svg>
          Back to main page
        </a>
      </div>
    </div>
  );
}

export function InternalError({ message }: { message: string }) {
  return (
    <div className='mx-auto flex size-full min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8'>
      <h1 className='block text-7xl font-bold text-gray-800 dark:text-white sm:text-8xl'>500</h1>
      <div className='mt-8 text-lg text-gray-600 dark:text-gray-400 sm:mt-10'>
        <p className='leading-8'>Oops, something went wrong.</p>
        <p className='leading-8'>{message}</p>
      </div>
      <div className='mt-8 flex flex-col items-center justify-center lg:mt-14'>
        <Link
          to='/'
          className='inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm
              font-semibold text-primary-500 ring-offset-white transition-all hover:text-primary-700 focus:outline-none focus:ring-1
              focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-gray-900 sm:w-auto'
        >
          <svg className='size-2.5' width='{20}' height='{20}' viewBox='0 0 16 16' fill='none'>
            <path
              d='M11.2792 1.64001L5.63273 7.28646C5.43747 7.48172 5.43747 7.79831 5.63273 7.99357L11.2792 13.64'
              stroke='currentColor'
              strokeWidth='{2}'
              strokeLinecap='round'
            />
          </svg>
          Back to main page
        </Link>
      </div>
    </div>
  );
}
