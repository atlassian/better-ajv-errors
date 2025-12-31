import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'better-ajv-errors': path.resolve(__dirname, './src/index.js'),
    },
  },
  test: {
    include: ['src/**/__tests__/**/*.js', 'typings.test-d.ts'],
    env: {
      CI: 'true',
    },
  },
});
