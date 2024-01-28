import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { cn } from '@/utils/ui-helper';

export const meta: MetaFunction = () => {
  return [{ title: 'Remix Start' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  return (
    <div className='mx-auto flex size-full min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8'>
      <h1 className='block text-7xl font-bold text-gray-800 sm:text-7xl dark:text-white'>
        Welcome to Remix
      </h1>
      <div className='mt-8 text-lg text-gray-600 sm:mt-10 dark:text-gray-300'>
        <p className='leading-8'>
          Minimal containerized Remix Stack with Tailwind CSS and TypeScript.
        </p>
      </div>
      <div className='mt-8 flex flex-col items-center justify-center lg:mt-14'>
        <Link
          to='https://remix.run/docs'
          target='_blank'
          rel='noreferrer'
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent px-3 py-2',
            'font-semibold text-primary-500 ring-offset-white transition-all hover:text-primary-700 sm:w-auto',
            'focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-gray-900'
          )}
        >
          Remix Docs
        </Link>
      </div>
    </div>
  );
}
