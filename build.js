#!/usr/bin/env node

const process = require('process');

const isCI = require('is-ci');
const fg = require('fast-glob');
const esbuild = require('esbuild');

const isEsmBuild = process.argv[2] !== '--cjs';

const config = {
  cjs: {
    format: 'cjs',
    platform: 'node',
    outdir: './lib/cjs',
  },
  esm: {
    outdir: './lib/esm',
  },
};

fg('src/**/*.js', {
  ignore: ['**/__tests__', '**/__fixtures__'],
})
  .then(entryPoints =>
    esbuild.build({
      ...(isEsmBuild ? config.esm : config.cjs),
      entryPoints,
      sourcemap: true,
      logLevel: isCI ? 'silent' : 'info',
      target: 'node12.13',
    })
  )
  .catch(_ => process.exit(1));
