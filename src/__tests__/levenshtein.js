import { describe, it, expect } from 'vite-plus/test';
import levenshtein from '../levenshtein';

describe('levenshtein', () => {
  it.each([
    ['', '', 0],
    ['', 'abc', 3],
    ['abc', '', 3],
    ['paragraph', 'paragraph', 0],
    ['kitten', 'sitting', 3],
    ['sitting', 'kitten', 3],
    ['paragarph', 'paragraph', 2],
    ['codeBlock', 'codeblock', 1],
    ['flaw', 'lawn', 2],
    ['abc', 'cba', 2],
  ])('measures %j to %j as %i', (left, right, distance) => {
    expect(levenshtein(left, right)).toBe(distance);
  });

  it('counts UTF-16 code units', () => {
    expect(levenshtein('😀', '😁')).toBe(1);
    expect(levenshtein('a', '😀')).toBe(2);
  });
});
