/*!
 * Portions of this file are based on code from `kentcdodds/kentcdodds.com`.
 * Credits to Kent C. Dodds: https://github.com/kentcdodds/kentcdodds.com
 */

import 'dotenv/config'
import type { CookieOptions } from '@remix-run/node'
import * as v from 'valibot'
import { logger } from './common'

/**
 * Defines the log level for the application.
 * The log level is determined by the environment variable. If the environment is production,
 * the log level is set to `info`. Otherwise, the log level is set to verbose `debug`.
 */
const LogLevelSchema = v.picklist(['info', 'warn', 'error', 'debug', 'query'] as const)

const EnvSchema = v.object({
  NODE_ENV: v.optional(v.picklist(['production', 'development', 'test'] as const), 'development'),
  APP_DOMAIN: v.string(),
  APP_BASE_URL: v.string(),
  APP_SECRET_KEY: v.string(),
  APP_LOG_LEVEL: v.optional(LogLevelSchema, 'info'),
  DATABASE_URL: v.pipe(
    v.string(),
    v.nonEmpty('Please enter the database url.'),
    v.url('The url is badly formatted.')
  ),
  SMTP_HOST: v.optional(v.string(), 'localhost'),
  SMTP_PORT: v.nullable(
    v.pipe(
      v.string(),
      v.transform((input) => {
        const parsed = Number.parseInt(input.toString())
        return Number.isNaN(parsed) ? 1025 : parsed
      })
    ),
    '1025'
  ),
  SMTP_USERNAME: v.optional(v.string()),
  SMTP_PASSWORD: v.optional(v.string()),
  SMTP_EMAIL_FROM: v.optional(v.string(), 'Remix Mailer <mailer@example.com>'),
})

export const GlobalCookiesOptions: Omit<CookieOptions, 'name' | 'expires'> = {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  secrets: process.env.NODE_ENV !== 'development' ? [process.env.APP_SECRET_KEY] : [],
  encode: (val) => {
    try {
      return atob(val) // Decode the Base64 cookie value
    } catch (error) {
      logger.error('Failed to encode cookie:', error)
      return val // Return original value if encoding fails
    }
  },
  decode: (val) => {
    try {
      return btoa(val) // Encode the cookie value to Base64
    } catch (error) {
      logger.error('Failed to decode cookie:', error)
      return val // Return original value if decoding fails
    }
  },
}

export type LogLevel = v.InferInput<typeof LogLevelSchema>

declare global {
  namespace NodeJS {
    interface ProcessEnv extends v.InferInput<typeof EnvSchema> {}
  }
}

export function initEnv() {
  try {
    const parsed = v.parse(EnvSchema, process.env)
    logger.debug('EnvSchema', parsed)
  } catch (error) {
    logger.error('❌ Invalid environment variables:', error)
    throw new Error('Invalid environment variables')
  }
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the
 * app is started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not
 * wish to be included in the client.
 * @returns all public ENV variables
 */
export function getClientEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV,
    APP_DOMAIN: process.env.APP_DOMAIN,
    APP_BASE_URL: process.env.APP_BASE_URL,
    APP_LOG_LEVEL: process.env.APP_LOG_LEVEL,
  }
}

type ENV = ReturnType<typeof getClientEnv>

declare global {
  var ENV: ENV
  interface Window {
    ENV: ENV
  }
}
