module.exports = {
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  rules: {},
};
