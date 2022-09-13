import { PrismaClient } from '@prisma/client'
import { Redis } from '@upstash/redis'
import invariant from 'tiny-invariant'

invariant(process.env.UPSTASH_REDIS_URL, 'UPSTASH_REDIS_URL must be set')
invariant(process.env.UPSTASH_REDIS_TOKEN, 'UPSTASH_REDIS_TOKEN must be set')

let prisma: PrismaClient

declare global {
  var __db__: PrismaClient
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient()
  }
  prisma = global.__db__
  prisma.$connect()
}

// initiate Upstash Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

export { prisma, redis }
