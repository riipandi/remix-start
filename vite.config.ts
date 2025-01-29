import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { isCI, isProduction } from 'std-env'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    !isCI && visualizer({ emitFile: true, template: 'treemap' }),
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
}))
