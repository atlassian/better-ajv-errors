---
"better-ajv-errors": patch
---

An array or object among an `enum`'s allowed values no longer throws `charCodeAt is not a function`. Only strings are compared when looking for a "Did you mean" suggestion.

Closes #180
