import { dirname, resolve } from 'node:path';

import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    dir: './tests',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup-test.ts'],
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'app') },
      { find: '~', replacement: resolve(__dirname, 'public') },
    ],
  },
});
