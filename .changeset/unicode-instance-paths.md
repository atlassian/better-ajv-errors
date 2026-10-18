---
"better-ajv-errors": patch
---

Errors at keys with any character outside `[\w-]` used to be dropped, or filtered as if they belonged to another key. Errors at `/名前` and `/$ref` were dropped, and an error at `/a.b` was filtered as `/a`, so a `required` error at `/a` hid it. Each of these errors now stays at its own key.

An enum error is still dropped when a sibling key has an error, and that now includes the keys above. `{kind: 'alpah', $schema: 1}` now reports the `$schema` error instead of the `kind` enum error.

A key that starts with digits, such as `1st`, is no longer cut to `1` and merged with the array index `1`.

An `additionalProperties` error for a property whose name contains `~` or `/` no longer throws `Couldn't find property`.
