#!/usr/bin/env node

const process = require('process');

const isCI = require('is-ci');
const esbuild = require('esbuild');

const isEsmBuild = process.argv[2] !== '--cjs';

const config = {
  cjs: {
    format: 'cjs',
    platform: 'node',
    outfile: './lib/cjs/index.js',
  },
  esm: {
    format: 'esm',
    outfile: './lib/esm/index.mjs',
  },
};

esbuild
  .build({
    ...(isEsmBuild ? config.esm : config.cjs),
    entryPoints: ['src/index.js'],
    external: ['@babel/code-frame', 'chalk'],
    bundle: true,
    sourcemap: true,
    logLevel: isCI ? 'silent' : 'info',
    target: 'node16.14',
  })
  .catch(_ => process.exit(1));
