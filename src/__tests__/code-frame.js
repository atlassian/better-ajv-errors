import { styleText } from 'node:util';
import { afterEach, describe, it, expect, vi } from 'vite-plus/test';
import { parse } from '@humanwhocodes/momoa';
import codeFrame from '../code-frame';

const locationOf = (source, key) =>
  parse(source).body.members.find(member => member.name.value === key).value.loc;

const plainFrame = (source, location) =>
  codeFrame(source, location, { message: 'here', color: false });

describe('codeFrame', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const doc =
    '{\n  "a": 1,\n  "b": 2,\n  "c": "baz",\n  "d": 4,\n  "e": 5,\n  "f": 6,\n  "g": 7\n}';

  it('marks a value with two lines above and three below', () => {
    expect(plainFrame(doc, locationOf(doc, 'c'))).toBe(
      [
        '  2 |   "a": 1,',
        '  3 |   "b": 2,',
        '> 4 |   "c": "baz",',
        '    |        ^^^^^ here',
        '  5 |   "d": 4,',
        '  6 |   "e": 5,',
        '  7 |   "f": 6,',
      ].join('\n')
    );
  });

  it('marks a single column without an end', () => {
    expect(plainFrame(doc, { start: locationOf(doc, 'c').start })).toBe(
      [
        '  2 |   "a": 1,',
        '  3 |   "b": 2,',
        '> 4 |   "c": "baz",',
        '    |        ^ here',
        '  5 |   "d": 4,',
        '  6 |   "e": 5,',
        '  7 |   "f": 6,',
      ].join('\n')
    );
  });

  it('marks every line of a range across lines and puts the message on the last', () => {
    const source = '{\n  "a": {\n    "b": 1,\n    "long": 22\n  },\n  "c": 3\n}';

    expect(plainFrame(source, locationOf(source, 'a'))).toBe(
      [
        '  1 | {',
        '> 2 |   "a": {',
        '    |        ^',
        '> 3 |     "b": 1,',
        '    | ^^^^^^^^^^^',
        '> 4 |     "long": 22',
        '    | ^^^^^^^^^^^^^^',
        '> 5 |   },',
        '    | ^^^ here',
        '  6 |   "c": 3',
        '  7 | }',
      ].join('\n')
    );
  });

  it('keeps tabs in the caret spacing', () => {
    const source = '{\n\t"a": "x"\n}';

    expect(plainFrame(source, locationOf(source, 'a'))).toBe(
      ['  1 | {', '> 2 | \t"a": "x"', '    | \t     ^^^ here', '  3 | }'].join('\n')
    );
  });

  it('splits lines where momoa counts them', () => {
    const crlf = '{\r\n  "a": 1,\r\n  "b": "x"\r\n}';
    // JSON allows a raw U+2028 in a string, and momoa doesn't count it as a line break.
    const lineSeparator = '{\n  "a": "x\u2028y",\n  "b": "z"\n}';

    expect(plainFrame(crlf, locationOf(crlf, 'b'))).toBe(
      ['  1 | {', '  2 |   "a": 1,', '> 3 |   "b": "x"', '    |        ^^^ here', '  4 | }'].join(
        '\n'
      )
    );
    expect(plainFrame(lineSeparator, locationOf(lineSeparator, 'b'))).toBe(
      [
        '  1 | {',
        '  2 |   "a": "x\u2028y",',
        '> 3 |   "b": "z"',
        '    |        ^^^ here',
        '  4 | }',
      ].join('\n')
    );
  });

  it('pads line numbers to the widest one shown', () => {
    const source = JSON.stringify(
      Object.fromEntries([...'abcdefghij'].map((key, index) => [key, index])),
      null,
      2
    );

    expect(plainFrame(source, locationOf(source, 'h'))).toBe(
      [
        '   7 |   "f": 5,',
        '   8 |   "g": 6,',
        '>  9 |   "h": 7,',
        '     |        ^ here',
        '  10 |   "i": 8,',
        '  11 |   "j": 9',
        '  12 | }',
      ].join('\n')
    );
  });

  it('highlights tokens and markers when color is on', () => {
    const source = '{"a": [true, null], "b": -1.5}';
    const frame = codeFrame(source, locationOf(source, 'b'), { message: 'here', color: true });

    expect(frame).toBe(
      [
        '\x1b[31m\x1b[1m>\x1b[22m\x1b[39m\x1b[90m 1 |\x1b[39m ' +
          '{\x1b[32m"a"\x1b[39m\x1b[33m:\x1b[39m [\x1b[36mtrue\x1b[39m\x1b[33m,\x1b[39m ' +
          '\x1b[36mnull\x1b[39m]\x1b[33m,\x1b[39m \x1b[32m"b"\x1b[39m\x1b[33m:\x1b[39m ' +
          '\x1b[35m-1.5\x1b[39m}',
        ' \x1b[90m   |\x1b[39m' +
          ' '.repeat(26) +
          '\x1b[31m\x1b[1m^^^^\x1b[22m\x1b[39m \x1b[31m\x1b[1mhere\x1b[22m\x1b[39m',
      ].join('\n')
    );
  });

  it.each(['1', '0'])('colors by default when styleText does, with FORCE_COLOR=%s', forceColor => {
    vi.stubEnv('FORCE_COLOR', forceColor);
    const frame = codeFrame(doc, locationOf(doc, 'c'), { message: 'here' });

    expect(frame.includes('\x1b[')).toBe(styleText('red', '-') !== '-');
    expect(frame.includes('\x1b[')).toBe(forceColor === '1');
  });
});
