---
"better-ajv-errors": patch
---

Errors at keys with any character outside `[\w-]` are no longer dropped or merged into another key. This covers Unicode keys such as `名前`, keys containing `$`, `@`, `.`, a space, `~` or `/`, and the empty key. Errors at `/a.b` used to be merged into `/a`, and errors at the other keys were not reported at all.

A key that starts with digits, such as `1st`, is no longer cut to `1` and merged with the array index `1`.

An `additionalProperties` error for a property whose name contains `~` or `/` no longer throws `Couldn't find property`.
