#!/usr/bin/env node

/**
 * This script is used to start the Remix development server.
 * Based on https://github.com/kentcdodds/nonce-remix-issue
 *
 * ╰─➤ $ pnpm add @remix-run/express express compression morgan helmet express-rate-limit
 * ╰─➤ $ pnpm add -D @types/express @types/compression @types/morgan
 */

import 'dotenv/config'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequestHandler } from '@remix-run/express'
import { installGlobals } from '@remix-run/node'
import compression from 'compression'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'

installGlobals()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BUILD_DIR = path.join(__dirname, 'build')

const staticOptions = {
  immutable: true,
  maxAge: '1y',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    }
  },
}

function parseNumber(raw) {
  if (raw === undefined) return undefined
  const maybe = Number(raw)
  if (Number.isNaN(maybe)) return undefined
  return maybe
}

function getLocalIpAddress() {
  return Object.values(os.networkInterfaces())
    .flat()
    .find((ip) => ip?.family === 'IPv4' && !ip.internal)?.address
}

async function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  const { createRequire } = await import('node:module')
  const require = createRequire(import.meta.url)

  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}

function getLoadContext(_req, res) {
  return {
    nonce: res.locals.nonce,
  }
}

const app = express()

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

app.use(compression({ level: 6, threshold: 0 }))

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
  })
)

// Remix fingerprints its assets so we can cache forever.
app.use(express.static('build/client', staticOptions))

// Everything else (like favicon.ico) is cached for an hour.
// You may want to be more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }))

app.use(morgan('tiny'))

app.use((_req, res, next) => {
  const nonce = Math.random().toString(36).substring(2)
  res.locals.nonce = nonce
  // res.setHeader('Content-Security-Policy', getContentSecurityPolicy(nonce))
  next()
})

const connectSource = process.env.NODE_ENV === 'development' ? ['ws://localhost:*'] : []
const imgSources = ['https://avatar.vercel.sh', 'https://loremflickr.com']
const fontSources = ['https://cdn.jsdelivr.net']

let scriptSrc
if (process.env.NODE_ENV === 'development') {
  // Allow the <LiveReload /> component to load without a nonce in the error pages
  scriptSrc = ["'self'", "'report-sample'", "'unsafe-inline'"]
} else if (typeof nonce === 'string' && nonce.length > 40) {
  scriptSrc = ["'self'", "'report-sample'", `'nonce-${nonce}'`]
} else {
  scriptSrc = ["'self'", "'report-sample'", "'unsafe-inline'"]
}

app.use(
  helmet({
    xPoweredBy: false,
    contentSecurityPolicy: {
      directives: {
        'base-uri': ["'self'"],
        'child-src': ["'self'"],
        'connect-src': ["'self'", ...connectSource],
        'default-src': ["'self'"],
        'font-src': ["'self'", ...fontSources],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'frame-src': ["'self'"],
        'img-src': ["'self'", 'data:', ...imgSources],
        'manifest-src': ["'self'"],
        'media-src': ["'self'"],
        'object-src': ["'none'"],
        'script-src': [...scriptSrc, "'unsafe-eval'"], // 'unsafe-eval' required for DOMPurify
        // 'script-src': ["'strict-dynamic'", (_req, res) => `'nonce-${res.locals.nonce}'`],
        // 'script-src-elem': ["'strict-dynamic'", (_req, res) => `'nonce-${res.locals.nonce}'`],
        'style-src': ["'self'", "'report-sample'", "'unsafe-inline'"],
        'worker-src': ["'self'", 'blob:', ...imgSources],
        // 'require-trusted-types-for': ["'script'"],
        // 'trusted-types': ['default', 'dompurify'],
      },
    },
  })
)
app.use((err, _req, res, _next) => {
  console.error(err.stack)
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
    console.info(`[remix-express] ${localUrl} (${networkUrl})`)
  } else {
    console.info(`[remix-express] ${localUrl}`)
  }
}

app.listen(PORT, onListen)
