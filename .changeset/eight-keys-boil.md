---
'better-ajv-errors': minor
---

:package: Swap `json-to-ast` with `momoa`

|   | `json-to-ast` | `momoa` |
| - | -------------: | -------: |
| **Small JSON** `23B` | 254,556 ops/sec | 329,012 ops/sec |
| **Medium JSON** `55KB` | 226 ops/sec | 246 ops/sec |
| **Large JSON** `25MB` | 0.19 ops/sec | 0.29 ops/sec |
