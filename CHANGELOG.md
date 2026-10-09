# better-ajv-errors

## 3.0.0

### Major Changes

- 0d8e31b: Ship the ES module and CommonJS builds as single bundles, `dist/index.mjs` and `dist/index.cjs`, replacing the per-file output under `lib/esm/` and `lib/cjs/`. The package entry points are unchanged, so only code that imported files under `lib/` directly needs to import `better-ajv-errors` instead. The bundles target Node.js 22, and the package is marked as free of side effects for bundlers.
- 22177c1: Replace `chalk` with Node.js built-in `util.styleText`. This change requires Node.js >= 22.
  
  Closes #219

### Patch Changes

- 419432c: Build the package with `vp pack` instead of esbuild.
- 86f69d7: Update dev dependencies, including ESLint 10, esbuild 0.28 and git-format-staged 4.
- d46ca05: Remove the unused Flow configuration and type annotations.
- 183fa01: With the `json` option, a key that appears more than once in an object no longer throws `Couldn't find property`. The error points at the last occurrence, which is the value `JSON.parse` keeps and ajv validates.
  
  Closes #253
- 69d2026: Format the source at a print width of 100.
- 8427a1f: Read the pnpm version for mise from `packageManager`.
- 2db467b: Run tests, linting, formatting and the commit hook through Vite+.
- 83db9ac: Declare the development Node.js version in `.node-version`.
- 9d019bb: An array or object among an `enum`'s allowed values no longer throws `charCodeAt is not a function`. Only strings are compared when looking for a "Did you mean" suggestion.
  
  Closes #180
- fe9d6d3: Pin pnpm 10.34.6 with the `packageManager` field.
- 5e7b636: Lint with oxlint instead of ESLint.
- 0ee7430: Install pnpm through mise instead of a Nix flake.
- ab3cfa4: Format the source with oxfmt instead of Prettier.
- 1327708: Error messages for the JSON root no longer start with a space, or with `: ` for keywords such as `type`.
- f69f096: Update `@humanwhocodes/momoa` to 3 and `@babel/code-frame` to 7.29.
- 2cd7c64: Document the Node.js and ajv requirements, ajv's `allErrors` option, the errors that are left out of the output, and the `path` field in the README.

## 2.0.4

### Patch Changes

- 257daa3: Fix typo in error message
- 10d7b68: Publish a scoped version for Atlassian
- d9eeb38: Corrects Issue #216. Now correctly shows all passed required errors on the same path level instead of stopping at the first one found.
- 92e502f: Fixes an issue with enum error printing that prevented parsing nullable enum errors.

## 2.0.3

### Patch Changes

- 1321dfe: Fix type exports
  - Bump packages: _only minor/patch_
  - Installed https://publint.dev and added it to `lint` so we don't break types again
  - Migrated `typings.test-d.ts` to use `vitest`
  - Fixed `type` `exports`

## 2.0.2

### Patch Changes

- 83348c8: Add missing `lib` in the published package

## 2.0.1

### Patch Changes

- 7915d20: Downgrade minimum supported Node version from `>= 22.16.0` to `>= 18.20.6`

## 2.0.0

### Major Changes

- 5ea0600: Minimum supported Node version bumped from `>= 12.13.0` to `>= 22.16.0`
- 6bd1a6e: Remove Jest and Bump dependencies

## 1.2.0

### Minor Changes

- 3918d58: Add integration with ajv-errors

### Patch Changes

- 6120105: Remove for...in loop to prevent possible enumeration errors

## 1.1.2

### Patch Changes

- a1cafc8: :wrench: Fix esm build

## 1.1.1

### Patch Changes

- 7c83bf6: :bug: Fix cli return type

## 1.1.0

### Minor Changes

- ade58e0: :package: Swap `json-to-ast` with `momoa`

  |                        |   `json-to-ast` |         `momoa` |
  | ---------------------- | --------------: | --------------: |
  | **Small JSON** `23B`   | 254,556 ops/sec | 329,012 ops/sec |
  | **Medium JSON** `55KB` |     226 ops/sec |     246 ops/sec |
  | **Large JSON** `25MB`  |    0.19 ops/sec |    0.29 ops/sec |

### Patch Changes

- abee681: :package: Restrict `leven` version to < 4

  `leven@4` only ships `esm` module which is not compatible with this library.

## 1.0.0

### Major Changes

- 146a859: :package: better-ajv-errors v1

  ### Breaking Changes
  - Dropped support for Node.js `< 12.13.0`
  - Default import in CommonJS format no longer supported

    **:no_entry_sign: Wrong**

    ```js
    const betterAjvErrors = require('better-ajv-errors');
    ```

    **:white_check_mark: Correct**

    ```js
    const betterAjvErrors = require('better-ajv-errors').default;
    // Or
    const { default: betterAjvErrors } = require('better-ajv-errors');
    ```

  ### Other Changes
  - Added ESM support
  - Moved from `babel` to `esbuild` _(99% faster build: from `2170ms` to `20ms`)_
    - https://github.com/atlassian/better-ajv-errors/pull/101#issuecomment-963129931
  - Bumped all `dependencies` & `devDependencies`

- ad60e6b: :nail_care: Improve typings and add test

  ### Breaking Changes
  - New TypeScript types are not fully backward compatible

### Patch Changes

- 768ce0f: Bump ws from 5.2.2 to 5.2.3
- dc45eb7: Bump tar from 4.4.10 to 4.4.19
- 5ef7b1e: Bump path-parse from 1.0.6 to 1.0.7
- 3ef2bbc: Bump tmpl from 1.0.4 to 1.0.5
- 46b57d3: Bump color-string from 1.5.3 to 1.6.0
- d568784: Bump lodash from 4.17.10 to 4.17.21
- e71f114: Bump browserslist from 4.7.0 to 4.17.6

## 0.8.2

### Patch Changes

- 2513443: :fire_engine: Bump `jsonpointer` - CVE-2021-23807

## 0.8.1

### Patch Changes

- 25cf308: :fire_engine: Bump `jsonpointer` - CVE-2021-23807

## 0.8.0

### Minor Changes

- 8846dda: ajv 8 support

## 0.7.0

### Minor Changes

- 4e6e4c7: Support json option to get accurate line/column listings

## 0.6.7

### Patch Changes

- 234c01d: Handle primitive values in EnumValidationError

## 0.6.6

### Patch Changes

- 84517c3: Fix a bug where enum error shows duplicate allowed values

## 0.6.5

### Patch Changes

- f2e0424: Fix a bug where nested errors were ignored when top level had enum errors
