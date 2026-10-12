---
"better-ajv-errors": minor
---

Rewrite the source in TypeScript and generate the type declarations from it: `dist/index.d.mts` and `dist/index.d.cts` replace the hand-written `typings.d.mts` and `typings.d.cts`. `IOutputError` gains `path`, which the `js` format has returned since 0.6.5, and `errors` accepts `null` and `undefined`, as ajv's `validate.errors` can be. When the `json` option lacks part of an error's path, the error names that part, such as `Couldn't find index 1 of /a/1`, instead of throwing `Cannot destructure property 'loc'`.
