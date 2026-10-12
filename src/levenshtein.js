/**
 * The number of single-character insertions, deletions and substitutions that turn `left` into
 * `right`. Characters are UTF-16 code units, as in `String.prototype.length`.
 *
 * @param {string} left
 * @param {string} right
 * @return {number}
 */
export default function levenshtein(left, right) {
  if (left === right) {
    return 0;
  }

  // The row holds one entry per code unit of the shorter string.
  if (left.length > right.length) {
    [left, right] = [right, left];
  }

  // `row[i]` is the distance from the first `i` code units of `left` to the part of `right` read
  // so far, starting from the empty part.
  const row = Array.from({ length: left.length + 1 }, (_, i) => i);
  for (let j = 1; j <= right.length; j++) {
    let diagonal = row[0];
    row[0] = j;
    for (let i = 1; i <= left.length; i++) {
      const above = row[i];
      const substitution = left.charCodeAt(i - 1) === right.charCodeAt(j - 1) ? 0 : 1;
      row[i] = Math.min(above + 1, row[i - 1] + 1, diagonal + substitution);
      diagonal = above;
    }
  }
  return row[left.length];
}
