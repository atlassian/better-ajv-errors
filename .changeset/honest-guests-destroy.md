---
'better-ajv-errors': major
---

:package: better-ajv-errors v1

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
