import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { cn } from '@/utils/ui-helper';

import { SocialLogin } from './__social';

export const meta: MetaFunction = () => {
  return [{ title: 'Sign in - Remix Start' }];
};

export default function SignInPage() {
  return (
    <main className='mx-auto w-full max-w-md p-6'>
      <div className='mt-7 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black'>
        <div className='p-4 sm:p-7'>
          <div className='text-center'>
            <h1 className='block text-2xl font-bold text-gray-800 dark:text-white'>Sign in</h1>
            <p className='mt-3 text-sm text-gray-600 dark:text-gray-300'>
              Don&apos;t have an account yet?{' '}
              <Link
                to='#'
                className='font-medium text-primary-600 decoration-2 hover:underline dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
              >
                Sign up here
              </Link>
            </p>
          </div>
          <div className='mt-5 lg:mt-7'>
            {/* Form */}
            <form>
              <div className='grid gap-y-4'>
                {/* Form Group */}
                <div>
                  <label htmlFor='email' className='sr-only'>
                    Email address
                  </label>
                  <div className='relative flex flex-col gap-1'>
                    <label htmlFor='email' className='text-sm font-medium text-white'>
                      Email Address
                    </label>
                    <div className='relative flex flex-col'>
                      <input
                        type='email'
                        placeholder='somebody@example.com'
                        className='block w-full rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:ring-gray-600'
                        required
                      />
                      <div className='pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3'>
                        <svg
                          className='size-5 text-red-500'
                          width={16}
                          height={16}
                          fill='currentColor'
                          viewBox='0 0 16 16'
                          aria-hidden='true'
                        >
                          <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className='mt-2 hidden text-xs text-red-600' id='email-error'>
                    Please include a valid email address
                  </p>
                </div>
                {/* End Form Group */}
                {/* Form Group */}
                <div>
                  <div className='relative flex flex-col gap-1'>
                    <label htmlFor='password' className='text-sm font-medium text-white'>
                      Password
                    </label>
                    <div className='relative flex flex-col'>
                      <input
                        type='password'
                        placeholder='************'
                        className='block w-full rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:ring-gray-600'
                        required
                      />
                      <div className='pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3'>
                        <svg
                          className='size-5 text-red-500'
                          width={16}
                          height={16}
                          fill='currentColor'
                          viewBox='0 0 16 16'
                          aria-hidden='true'
                        >
                          <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className='mt-2 hidden text-xs text-red-600' id='password-error'>
                    8+ characters required
                  </p>
                </div>
                {/* End Form Group */}
                {/* Checkbox */}
                <div className='flex items-center'>
                  <div className='flex'>
                    <input
                      id='remember-me'
                      name='remember-me'
                      type='checkbox'
                      className='pointer-events-none mt-0.5 shrink-0 rounded border-gray-200 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-primary-500 dark:checked:bg-primary-500 dark:focus:ring-offset-gray-800'
                    />
                  </div>
                  <div className='inline-flex w-full items-center justify-between'>
                    <div className='ms-2.5'>
                      <label htmlFor='remember-me' className='text-sm dark:text-white'>
                        Remember me
                      </label>
                    </div>
                    <div className='flex items-center justify-between'>
                      <label htmlFor='password' className='sr-only'>
                        Password
                      </label>
                      <Link
                        to='#'
                        className='text-sm text-primary-600 decoration-2 hover:underline dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
                        tabIndex={-1}
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                </div>
                {/* End Checkbox */}
                <button
                  type='submit'
                  className={cn(
                    'pressed:bg-primary-800 cursor-pointer rounded-md border border-black/10',
                    'bg-primary-600 px-4 py-2 text-center text-sm text-white transition',
                    'hover:bg-primary-700 dark:border-white/10 dark:shadow-none'
                  )}
                >
                  Continue
                </button>
              </div>
            </form>
            {/* End Form */}
            <SocialLogin label='Or, login with' />
          </div>
        </div>
      </div>
    </main>
  );
}
