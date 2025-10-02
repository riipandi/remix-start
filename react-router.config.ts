import { resolve } from 'node:path'
import type { Config } from '@react-router/dev/config'

export default {
  buildDirectory: resolve('dist'),
  ssr: true, // Server-side render by default.
} satisfies Config
