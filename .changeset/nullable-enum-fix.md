---
"better-ajv-errors": patch
---

fix: An enum that starts with null and has no string values no longer crashes or produces invalid error messages like `", value"` - null is now properly formatted as 'null' in both CLI and JSON output formats.
