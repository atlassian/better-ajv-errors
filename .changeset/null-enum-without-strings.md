---
"better-ajv-errors": patch
---

An `enum` whose allowed values are all non-strings, with `null` first, such as `[null, 5]`, no longer throws `Cannot read properties of null (reading 'length')`.

Closes #224
