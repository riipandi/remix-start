/*!
 * Portions of this file are based on code from `kentcdodds/kentcdodds.com`.
 * Credits to Kent C. Dodds: https://github.com/kentcdodds/kentcdodds.com
 */

import { PassThrough, Transform } from 'node:stream'
import {
  type ActionFunctionArgs,
  type HandleDocumentRequestFunction,
  type LoaderFunctionArgs,
  createReadableStreamFromReadable,
} from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { isbot } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { NonceProvider } from '#/context/providers/nonce-provider'
import { getClientEnv, initEnv } from '#/utils/env.server'
import { logger } from './utils/common'

initEnv()

global.ENV = getClientEnv()

const ABORT_DELAY = 5000

// NOTE: we've got a patch-package on Remix that adds the loadContext argument
// so we can access the cspNonce in the entry. Hopefully this gets supported:
// https://github.com/remix-run/remix/discussions/4603
type DocRequestArgs = Parameters<HandleDocumentRequestFunction>

function handleBotRequest(...args: DocRequestArgs) {
  const [request, responseStatusCode, responseHeaders, remixContext, loadContext] = args
  const nonce = loadContext.cspNonce ? String(loadContext.cspNonce) : ''

  return new Promise((resolve, reject) => {
    const stream = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
      </NonceProvider>,
      {
        nonce,
        // Use onAllReady to wait for the entire document to be ready
        onAllReady() {
          responseHeaders.set('Content-Type', 'text/html; charset=UTF-8')

          const body = new PassThrough()

          // find/replace all instances of the string "data-evt-" with ""
          // this is a bit of a hack because React won't render the "onload"
          // prop, which we use for blurrable image
          const dataEvtTransform = new Transform({
            transform(chunk, _encoding, callback) {
              const string = chunk.toString()
              const replaced = string.replace(/data-evt-/g, `nonce="${nonce}" `)
              callback(null, replaced)
            },
          })

          stream.pipe(dataEvtTransform).pipe(body)

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              status: responseStatusCode,
              headers: responseHeaders,
            })
          )
        },
        onShellError(err: unknown) {
          reject(err)
        },
      }
    )
    setTimeout(() => stream.abort(), ABORT_DELAY)
  })
}

function handleBrowserRequest(...args: DocRequestArgs) {
  const [request, responseStatusCode, responseHeaders, remixContext, loadContext] = args
  const nonce = loadContext.cspNonce ? String(loadContext.cspNonce) : ''

  return new Promise((resolve, reject) => {
    let didError = false
    const stream = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
      </NonceProvider>,
      {
        nonce,
        // use onShellReady to wait until a suspense boundary is triggered
        onShellReady() {
          responseHeaders.set('Content-Type', 'text/html; charset=UTF-8')

          const body = new PassThrough()

          // find/replace all instances of the string "data-evt-" with ""
          // this is a bit of a hack because React won't render the "onload"
          // prop, which we use for blurrable image
          const dataEvtTransform = new Transform({
            transform(chunk, _encoding, callback) {
              const string = chunk.toString()
              const replaced = string.replace(/data-evt-/g, `nonce="${nonce}" `)
              callback(null, replaced)
            },
          })

          stream.pipe(dataEvtTransform).pipe(body)
          resolve(
            new Response(createReadableStreamFromReadable(body), {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          )
        },
        onShellError(err: unknown) {
          reject(err)
        },
        onError(err: unknown) {
          didError = true
          logger.error(err)
        },
      }
    )
    setTimeout(() => stream.abort(), ABORT_DELAY)
  })
}

export async function handleDataRequest(response: Response) {
  if (response.status >= 500) {
    // await ensurePrimary()
  }
  return response
}

export function handleError(
  error: unknown,
  { request }: LoaderFunctionArgs | ActionFunctionArgs
): void {
  // Skip capturing if the request is aborted as Remix docs suggest
  // Ref: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
  if (request.signal.aborted) {
    return
  }
  if (error instanceof Error) {
    logger.error(error.stack)
  } else {
    logger.error(error)
  }
}

export default async function handleDocumentRequest(...args: DocRequestArgs) {
  const [request, responseStatusCode, responseHeaders, remixContext, loadContext] = args
  if (responseStatusCode >= 500) {
    // if we had an error, let's just send this over to the primary and see
    // if it can handle it.
    // await ensurePrimary()
  }

  if (process.env.NODE_ENV !== 'production') {
    responseHeaders.set('Cache-Control', 'no-store')
  }

  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    responseHeaders.append('Document-Policy', 'js-profiling')
  }

  responseHeaders.append('Link', '<https://cdn.jsdelivr.net>; rel="preconnect"')
  responseHeaders.append('Link', '<https://avatar.vercel.sh>; rel="preconnect"')
  responseHeaders.append('Link', '<https://loremflickr.com>; rel="preconnect"')

  // If the request is from a bot, we want to wait for the full
  // response to render before sending it to the client. This
  // ensures that bots can see the full page content.
  if (isbot(request.headers.get('user-agent'))) {
    return handleBotRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext)
  }

  return handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    loadContext
  )
}
