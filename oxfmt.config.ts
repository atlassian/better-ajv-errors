import { defineConfig } from "oxfmt";

export default defineConfig({
  // Prettier's default, which this code was formatted with.
  printWidth: 80,
  singleQuote: true,
  trailingComma: "es5",
  arrowParens: "avoid",
  sortPackageJson: false,
  ignorePatterns: [],
});