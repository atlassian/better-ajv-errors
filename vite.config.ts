import path from 'node:path';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  resolve: {
    alias: {
      'better-ajv-errors': path.resolve(import.meta.dirname, './src/index.js'),
    },
  },
  test: {
    include: ['src/**/__tests__/**/*.js', 'typings.test-d.ts'],
    env: {
      CI: 'true',
    },
    coverage: {
      include: ['src/**/*.js'],
    },
  },
  lint: {
    categories: {
      correctness: 'error',
    },
    env: {
      node: true,
    },
    rules: {
      'no-case-declarations': 'error',
      'no-empty': 'error',
      'no-fallthrough': 'error',
      'no-prototype-builtins': 'error',
      'no-redeclare': 'error',
      'no-regex-spaces': 'error',
      'no-undef': 'error',
      'no-unexpected-multiline': 'error',
      'no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }],
      'no-useless-assignment': 'error',
      'preserve-caught-error': 'error',
    },
    overrides: [
      {
        files: ['src/**/*.js'],
        plugins: ['vitest'],
        rules: {
          'vitest/no-commented-out-tests': 'error',
          'vitest/no-disabled-tests': 'warn',
          'vitest/no-identical-title': 'error',
          'vitest/no-import-node-test': 'error',
          'vitest/no-interpolation-in-snapshots': 'error',
          'vitest/no-mocks-import': 'error',
          'vitest/no-unneeded-async-expect-function': 'error',
          'vitest/prefer-called-exactly-once-with': 'error',
          'vitest/prefer-snapshot-hint': 'off',
        },
      },
    ],
  },
  fmt: {
    singleQuote: true,
    trailingComma: 'es5',
    arrowParens: 'avoid',
    sortPackageJson: false,
  },
  pack: {
    entry: 'src/index.js',
    format: ['esm', 'cjs'],
    sourcemap: true,
    dts: false,
    // Keeps `require('better-ajv-errors').default`, which `typings.d.cts` describes.
    cjsDefault: false,
  },
  staged: {
    'src/**/*.js': 'vp fmt',
  },
});
