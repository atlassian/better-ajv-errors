const { defineConfig } = require("eslint/config");

const globals = require("globals");
const vitest = require("@vitest/eslint-plugin");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

module.exports = defineConfig([{
  files: ["src/**/*.js"],
  languageOptions: {
    globals: {
      ...globals.node,
    },

    ecmaVersion: 2018,
    sourceType: "module",
    parserOptions: {},
  },

  // extends: compat.extends("eslint:recommended", "plugin:prettier/recommended"),
  extends: compat.extends("eslint:recommended"),

  plugins: {
    vitest,
  },

  rules: {
    "no-unused-vars": [2, {
      args: "all",
      argsIgnorePattern: "^_",
    }],
    ...vitest.configs.recommended.rules,
  },

  ignores: [
    "flow-typed/",
    "lib/",
    "node_modules/",
    "dist/",
  ],
}]);
