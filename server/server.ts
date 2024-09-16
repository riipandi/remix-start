#!/usr/bin/env node

/**
 * This script is used to start the Remix development server.
 * Based on https://github.com/kentcdodds/nonce-remix-issue
 *
 * ╰─➤ $ pnpm add @remix-run/express express compression morgan helmet express-rate-limit
 * ╰─➤ $ pnpm add -D @types/express @types/compression @types/morgan
 */

import 'dotenv/config'
import path from 'node:path'
import { createRequestHandler } from '@remix-run/express'
import { installGlobals } from '@remix-run/node'
import compression from 'compression'
import type { NextFunction, Request, Response } from 'express'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import logger from './logger.js'
import { getLoadContext, getLocalIpAddress, getRequestIpAddress } from './utils.js'
import { generateCspDirectives, preferHeader } from './utils.js'
import { parseNumber, purgeRequireCache } from './utils.js'

installGlobals()

// Get Remix build directory
const BUILD_DIR = path.join(process.cwd(), 'dist/remix')

const staticOptions = {
  immutable: true,
  maxAge: '1y',
  setHeaders: (res: express.Response, path: string) => {
    if (path.endsWith('.html')) {
      res.set('Cache-Control', 'public, max-age=0, must-revalidate')
    }
  },
}

const app = express()

// @see: http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

app.use(compression({ level: 6, threshold: 0 }))

if (process.env.ENABLE_RATE_LIMIT === 'true') {
  app.use(
    rateLimit({
      windowMs: 60 * 1000 * 15, // 15 minutes
      max: 1000, // limit request for each IP per window
    })
  )
}

// Remix fingerprints its assets so we can cache forever.
app.use(express.static(`${BUILD_DIR}/client`, staticOptions))

// @see: https://community.fly.io/t/recommended-setting-for-trust-proxy-on-express/6346
const flyHeaders = function flyHeaders(req: Request, _res: Response, next: NextFunction) {
  if (process.env.FLY_ALLOC_ID == null) return next()

  req.app.set('trust proxy', true)

  preferHeader(req, 'Fly-Client-IP', 'X-Forwarded-For')
  preferHeader(req, 'Fly-Forwarded-Port', 'X-Forwarded-Port')
  preferHeader(req, 'Fly-Forwarded-Proto', 'X-Forwarded-Protocol')
  preferHeader(req, 'Fly-Forwarded-Ssl', 'X-Forwarded-Ssl')

  return next()
}

app.use(flyHeaders)

morgan.token('remote-addr', function getRemoteAddr(req: Request) {
  return getRequestIpAddress(req) as string
})

app.use(
  morgan('short', {
    skip: (req) => req.method === 'HEAD',
    stream: {
      write: (message) => logger.server(message.trim()),
    },
  })
)

app.use((_req, res, next) => {
  const nonce = Math.random().toString(36).substring(2)
  res.locals.nonce = nonce
  // res.setHeader('Content-Security-Policy', getContentSecurityPolicy(nonce))
  next()
})

app.use(
  helmet({
    xPoweredBy: false,
    contentSecurityPolicy: {
      directives: generateCspDirectives(),
    },
  })
)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('[SERVER]', err.stack)
  res.status(500).send(`Something went wrong: ${err.message}`)
})

async function createRemixHandler() {
  const mode = process.env.NODE_ENV
  const serverPath = `${BUILD_DIR}/server/index.js`
  logger.server('Server running in', mode, 'mode')
  if (mode === 'development') {
    return async (req: Request, res: Response, next: NextFunction) => {
      await purgeRequireCache(BUILD_DIR)
      const { default: build } = await import(serverPath)
      return createRequestHandler({ build, mode, getLoadContext })(req, res, next)
    }
  }
  const build = await import(serverPath)
  return createRequestHandler({ build, mode, getLoadContext })
}

const remixHandler = await createRemixHandler()

app.all('*', remixHandler)

const PORT = parseNumber(process.env.PORT) ?? 3000

const onListen = () => {
  const address = getLocalIpAddress()
  const localUrl = `http://localhost:${PORT}`
  const networkUrl = address ? `http://${address}:${PORT}` : null
  if (networkUrl) {
    logger.server(`[remix-express] ${localUrl} (${networkUrl})`)
  } else {
    logger.server(`[remix-express] ${localUrl}`)
  }
}

app.listen(PORT, onListen)
