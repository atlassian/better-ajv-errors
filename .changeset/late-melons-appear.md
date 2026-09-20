---
'better-ajv-errors': patch
---

Fix broken error output for nullable enums: `getError()` now renders `null` in the list of allowed values instead of an empty string with a trailing comma, and `findBestMatch()` no longer throws when `null` is the only allowed value. Adds regression tests for #224.
