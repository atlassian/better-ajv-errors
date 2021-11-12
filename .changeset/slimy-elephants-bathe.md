---
'better-ajv-errors': patch
---

:package: Restrict `leven` version to < 4

`leven@4` only ships `esm` module which is not compatible with this library.
