import { defineConfig } from "eslint/config";

import globals from "globals";
import vitest from "@vitest/eslint-plugin";
import js from "@eslint/js";

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([{
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
