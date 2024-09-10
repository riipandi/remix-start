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
import { fileURLToPath } from 'node:url'
import { createRequestHandler } from '@remix-run/express'
import { installGlobals } from '@remix-run/node'
import compression from 'compression'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import logger from './logger.js'
import { getLoadContext, getLocalIpAddress, getRequestIpAddress } from './utils.js'
import { parseIntAsBoolean, parseNumber, purgeRequireCache } from './utils.js'
import { generateCspDirectives, preferHeader } from './utils.js'

installGlobals()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BUILD_DIR = path.join(__dirname, '../build')

const staticOptions = {
  immutable: true,
  maxAge: '1y',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    }
  },
}

const app = express()

// @see: http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

app.use(compression({ level: 6, threshold: 0 }))

if (process.env.ENABLE_RATE_LIMIT === 'true' || parseIntAsBoolean(process.env.ENABLE_RATE_LIMIT)) {
  app.use(
    rateLimit({
      windowMs: 60 * 1000 * 15, // 15 minutes
      max: 1000, // limit request for each IP per window
    })
  )
}

// Remix fingerprints its assets so we can cache forever.
app.use(express.static('build/client', staticOptions))

// @see: https://community.fly.io/t/recommended-setting-for-trust-proxy-on-express/6346
const flyHeaders = function flyHeaders(req, _res, next) {
  if (process.env.FLY_APP_NAME == null) return next()

  req.app.set('trust proxy', true)

  preferHeader(req, 'Fly-Client-IP', 'X-Forwarded-For')
  preferHeader(req, 'Fly-Forwarded-Port', 'X-Forwarded-Port')
  preferHeader(req, 'Fly-Forwarded-Proto', 'X-Forwarded-Protocol')
  preferHeader(req, 'Fly-Forwarded-Ssl', 'X-Forwarded-Ssl')

  return next()
}

app.use(flyHeaders)

morgan.token('remote-addr', function getRemoteAddr(req) {
  return getRequestIpAddress(req)
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

app.use((err, _req, res, _next) => {
  logger.error('[SERVER]', err.stack)
  res.status(500).send(`Something went wrong: ${err.message}`)
})

app.all(
  '*',
  process.env.NODE_ENV === 'development'
    ? async (req, res, next) => {
        await purgeRequireCache()
        // `remix build` and `remix dev` output files to a build directory,
        // you need to pass that build to the request handler.
        const { default: build } = await import(BUILD_DIR)
        const mode = process.env.NODE_ENV
        return createRequestHandler({ build, mode, getLoadContext })(req, res, next)
      }
    : createRequestHandler({
        build: await import(`${BUILD_DIR}/server/index.js`),
        mode: process.env.NODE_ENV,
        getLoadContext,
      })
)

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
