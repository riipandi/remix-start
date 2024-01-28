import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';

import { InternalError, NotFound } from '@/components/errors';
import { cn, isDevelopment } from '@/utils/ui-helper';

import styles from './styles.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const meta: MetaFunction = () => {
  return [{ title: 'Remix Start' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function App() {
  return (
    <html lang='en' className='h-full min-h-screen'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className={cn(isDevelopment() && 'debug-screen')}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const pageTitle = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Something wrong';

  return (
    <html lang='en'>
      <head>
        <title>{pageTitle}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {isRouteErrorResponse(error) ? (
            <NotFound status={error.status} statusText={error.statusText} />
          ) : error instanceof Error ? (
            <InternalError message={error.message} />
          ) : (
            'Unknown Error'
          )}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}
