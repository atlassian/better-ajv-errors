---
"better-ajv-errors": minor
---

Name the expected value in `const` errors. ajv reports a `const` failure as `must be equal to constant` and carries the expected value in `params.allowedValue`, which was dropped because `const` had no handler of its own. A `const` is an `enum` with one allowed value, so it is now rewritten as one and goes through the existing `enum` handling: the error reads `/node must be equal to constant: >=18.12.0`, redundant branches of a `oneOf` are filtered out, sibling branches merge into a single error, and a close value gets a "Did you mean" suggestion.
