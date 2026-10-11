---
"better-ajv-errors": patch
---

Render code frames without `@babel/code-frame`, which removes it and its dependencies `@babel/helper-validator-identifier`, `js-tokens` and `picocolors`. Code frames are colored only when the headings are, so piped output with `CI` set no longer mixes colored frames with plain headings. A raw U+2028 or U+2029 inside a JSON string no longer moves the carets to the wrong line. In an error that spans several lines, each line in between is underlined to its own length, the last line no longer gets an extra caret, and line numbers stay aligned when a frame shows both one- and three-digit line numbers.
