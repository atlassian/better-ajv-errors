---
"better-ajv-errors": patch
---

Throw a clear error when `data` cannot be serialized to JSON. `JSON.stringify` returns `undefined` for `undefined`, functions and symbols, so the failure used to surface from inside the JSON parser as `Cannot read properties of undefined`, which pointed at `@humanwhocodes/momoa` rather than at the argument. The thrown `TypeError` now names `data` and points at the `json` option, which still works when `data` itself cannot be serialized.
