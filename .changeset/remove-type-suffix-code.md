---
"better-ajv-errors": patch
---

Remove the code meant to add an array element's `type` after its index in `error` paths. It has matched nothing since 1.1.0, so the output is unchanged.
