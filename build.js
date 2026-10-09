#!/usr/bin/env node

import isCI from 'is-ci';
import * as esbuild from 'esbuild';

const options = {
  entryPoints: ['src/index.js'],
  bundle: true,
  packages: 'external',
  platform: 'node',
  sourcemap: true,
  logLevel: isCI ? 'silent' : 'info',
  target: 'node22',
};

await Promise.all([
  esbuild.build({ ...options, format: 'esm', outfile: './lib/index.js' }),
  esbuild.build({ ...options, format: 'cjs', outfile: './lib/index.cjs' }),
]);
