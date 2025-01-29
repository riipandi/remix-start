import type { Config } from '@react-router/dev/config'
import { resolve } from 'pathe'

export default {
  buildDirectory: resolve('dist'),
  ssr: true, // Server-side render by default.
} satisfies Config
