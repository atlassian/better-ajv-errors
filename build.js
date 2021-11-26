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
    format: 'esm',
    outdir: './lib/esm',
    outExtension: {
      '.js': '.mjs',
    },
    bundle: true,
    plugins: [
      {
        name: 'add-mjs',
        setup(build) {
          build.onResolve({ filter: /.*/ }, args => {
            if (args.kind === 'entry-point') return;
            let path = args.path;
            if (path.startsWith('.') && !path.endsWith('.mjs')) path += '.mjs';
            return { path, external: true };
          });
        },
      },
    ],
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
