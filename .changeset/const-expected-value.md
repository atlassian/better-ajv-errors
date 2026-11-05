---
"better-ajv-errors": minor
---

Name the expected value in `const` errors. ajv reports a `const` failure as `must be equal to constant` and carries the expected value in `params.allowedValue`, which was dropped because `const` had no handler of its own. A `const` error now reads `/node must be equal to constant: ">=18.12.0"`, with the value printed as JSON so strings stay quoted and `null`, `false` and numbers are unambiguous. The `cli` format gains the value in its header and in the codeframe pointer.
