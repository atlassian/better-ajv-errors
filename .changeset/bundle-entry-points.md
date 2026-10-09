---
"better-ajv-errors": major
---

Ship the ES module and CommonJS builds as single bundles, `dist/index.mjs` and `dist/index.cjs`, replacing the per-file output under `lib/esm/` and `lib/cjs/`. The package entry points are unchanged, so only code that imported files under `lib/` directly needs to import `better-ajv-errors` instead. The bundles target Node.js 22, and the package is marked as free of side effects for bundlers.
