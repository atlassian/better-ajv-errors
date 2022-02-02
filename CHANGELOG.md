# better-ajv-errors

## 1.0.2

### Patch Changes

- f6473a0: Fix file extensions for ESM imports to work

## 1.0.1

### Patch Changes

- 80cf129: Improve typings and add test
- 508d334: Make ESM module importable

## 1.0.0

### Major Changes

- 146a859: :package: better-ajv-errors v1

  ### Breaking Changes

  - Dropped support for Node.js `< 12.13.0`
  - Default import in CommonJS format no longer supported

    **:no_entry_sign: Wrong**

    ```js
    const betterAjvErrors = require('@sidvind/better-ajv-errors');
    ```

    **:white_check_mark: Correct**

    ```js
    const betterAjvErrors = require('@sidvind/better-ajv-errors').default;
    // Or
    const { default: betterAjvErrors } = require('@sidvind/better-ajv-errors');
    ```

  ### Other Changes

  - Added ESM support
  - Moved from `babel` to `esbuild` _(99% faster build: from `2170ms` to `20ms`)_
    - https://github.com/atlassian/better-ajv-errors/pull/101#issuecomment-963129931
  - Bumped all `dependencies` & `devDependencies`

### Patch Changes

- 768ce0f: Bump ws from 5.2.2 to 5.2.3
- dc45eb7: Bump tar from 4.4.10 to 4.4.19
- 5ef7b1e: Bump path-parse from 1.0.6 to 1.0.7
- 3ef2bbc: Bump tmpl from 1.0.4 to 1.0.5
- 45e728b: :fire_engine: Bump `jsonpointer` - CVE-2021-23807
- 46b57d3: Bump color-string from 1.5.3 to 1.6.0
- d568784: Bump lodash from 4.17.10 to 4.17.21
- e71f114: Bump browserslist from 4.7.0 to 4.17.6

## 0.9.2

### Patch Changes

- f24ba8a: Typescript: Allow usage without es modules

## 0.9.1

### Patch Changes

- 34975da: set `sideEffects` to false

## 0.9.0

### Minor Changes

- a7d4fd9: ajv 8 support

## 0.8.0

### Minor Changes

- 54c05fc: Support json option to get accurate line/column listings

  - 54c05fc: Require Node 10

### Patch Changes

- 54c05fc: fix enumeration in anyOf

## 0.7.0

### Minor Changes

- 4e6e4c7: Support json option to get accurate line/column listings

## 0.6.10

### Patch Changes

- 97d5a40: Correct TypeScript type definition

## 0.6.9

### Patch Changes

- 75f4f86: fix build

## 0.6.8

### Patch Changes

- d46525e: Drop legacy build and it's runtime dependencies

## 0.6.7

### Patch Changes

- 234c01d: Handle primitive values in EnumValidationError

## 0.6.6

### Patch Changes

- 84517c3: Fix a bug where enum error shows duplicate allowed values

## 0.6.5

### Patch Changes

- f2e0424: Fix a bug where nested errors were ignored when top level had enum errors
