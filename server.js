#!/usr/bin/env node

import compression from 'compression'
import consola from 'consola'
import express from 'express'
import morgan from 'morgan'
import { resolve } from 'pathe'
import { env, isDevelopment } from 'std-env'

// Short-circuit the type-checking of the built output.
const BUILD_PATH = resolve('dist/server/index.js')
const PORT = Number.parseInt(env.PORT || '3000')

const app = express()

app.use(compression())
app.disable('x-powered-by')

if (isDevelopment) {
  consola.info('Starting development server')
  const viteDevServer = await import('vite').then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    })
  )
  app.use(viteDevServer.middlewares)
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule('./server/app.ts')
      return await source.app(req, res, next)
    } catch (error) {
      if (typeof error === 'object' && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error)
      }
      next(error)
    }
  })
} else {
  consola.info('Starting production server')
  app.use('/assets', express.static('dist/client/assets', { immutable: true, maxAge: '1y' }))
  app.use(express.static('dist/client', { maxAge: '1h' }))
  app.use(await import(BUILD_PATH).then((mod) => mod.app))
}

app.use(morgan('tiny'))

app.listen(PORT, () => {
  consola.info(`Server is running on http://localhost:${PORT}`)
})
