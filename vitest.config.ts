import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/__tests__/**/*.js'],
    env: {
      CI: 'true',
    },
  },
});
