import * as fs from 'fs';

const external = Object.keys(
  JSON.parse(fs.readFileSync('./package.json', 'utf8')).dependencies,
);

export default [
  {
    input: 'src/index.js',
    output: {
      entryFileNames: '[name].js',
      dir: 'dist',
      format: 'cjs',
      exports: 'named',
    },
    external,
  },
  {
    input: 'src/index.js',
    output: {
      entryFileNames: '[name].mjs',
      dir: 'dist',
      format: 'esm',
    },
    external,
  },
];
