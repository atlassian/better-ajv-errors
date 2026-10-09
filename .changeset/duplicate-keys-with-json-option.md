---
"better-ajv-errors": patch
---

With the `json` option, a key that appears more than once in an object no longer throws `Couldn't find property`. The error points at the last occurrence, which is the value `JSON.parse` keeps and ajv validates.

Closes #253
