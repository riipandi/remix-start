/*!
 * Portions of this file are based on code from `kentcdodds/kentcdodds.com`.
 * Credits to Kent C. Dodds: https://github.com/kentcdodds/kentcdodds.com
 */

import * as v from 'valibot'

const EnvSchema = v.object({
  NODE_ENV: v.picklist(['production', 'development', 'test'] as const),
  APP_DOMAIN: v.string(),
  APP_BASE_URL: v.string(),
  APP_SECRET_KEY: v.string(),
  APP_LOG_LEVEL: v.string(),
  DATABASE_URL: v.string(),
  SMTP_HOST: v.string(),
  SMTP_PORT: v.number(),
  SMTP_USERNAME: v.string(),
  SMTP_PASSWORD: v.string(),
  SMTP_EMAIL_FROM: v.string(),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends v.InferInput<typeof EnvSchema> {}
  }
}

export function init() {
  try {
    const parsed = v.parse(EnvSchema, process.env)
    console.debug('EnvSchema', parsed)
  } catch (error) {
    console.error('❌ Invalid environment variables:', error)
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
export function getEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV,
    APP_DOMAIN: process.env.APP_DOMAIN,
    APP_BASE_URL: process.env.APP_BASE_URL,
  }
}

type ENV = ReturnType<typeof getEnv>

declare global {
  var ENV: ENV
  interface Window {
    ENV: ENV
  }
}
