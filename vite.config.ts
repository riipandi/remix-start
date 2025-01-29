import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import consola from 'consola'
import { visualizer } from 'rollup-plugin-visualizer'
import { isCI, isProduction, isTest } from 'std-env'
import { type Logger, defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// @ref: https://remix.run/docs/en/main/future/vite#plugin-usage-with-other-vite-based-tools-eg-vitest-storybook
const isTestOrStorybook = process.env.NODE_ENV === 'test' || process.argv[1]?.includes('storybook')
const isCIOrProduction = isCI || isProduction

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    tailwindcss(),
    !isTestOrStorybook && reactRouter(),
    // `emitFile` is necessary since React Router builds more than one bundle!
    !isCIOrProduction && visualizer({ emitFile: true, template: 'treemap' }),
    tsconfigPaths(),
  ],
  server: { port: 3000, host: true },
  build: {
    manifest: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1024 * 4,
    reportCompressedSize: false,
    minify: isProduction,
    rollupOptions: isSsrBuild ? { input: './server/app.ts' } : undefined,
    terserOptions: { format: { comments: false } },
  },
  esbuild: { legalComments: 'inline' },
  customLogger: !isTest
    ? ({
        info: (msg: string) => consola.withTag('vite').info(msg),
        warn: (msg: string) => consola.withTag('vite').warn(msg),
        warnOnce: (msg: string) => consola.withTag('vite').warn(msg),
        error: (msg: string) => consola.withTag('vite').error(msg),
        clearScreen: () => {},
        hasErrorLogged: () => true,
        hasWarned: false,
      } as Logger)
    : undefined,
}))
