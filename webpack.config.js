var path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'better-ajv-errors',
    libraryTarget: 'commonjs2',
  },
};
