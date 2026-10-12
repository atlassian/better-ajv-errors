import { styleText } from 'node:util';
import { tokenize, type Location, type TokenType } from '@humanwhocodes/momoa';

type Format = Parameters<typeof styleText>[0];
type Paint = (format: Format, text: string) => string;
type Position = Pick<Location, 'line' | 'column'>;

const LINES_ABOVE = 2;
const LINES_BELOW = 3;

// The line breaks momoa counts, so that its line numbers index into the split source.
const NEWLINE = /\r\n|[\r\n]/;

const TOKEN_STYLES: Partial<Record<TokenType, Format>> = {
  String: 'green',
  Number: 'magenta',
  Boolean: 'cyan',
  Null: 'cyan',
  Colon: 'yellow',
  Comma: 'yellow',
};

const MARKER_STYLE: Format = ['red', 'bold'];

// The check `styleText` makes for the headings, so that the frame is colored along with them.
const supportsColor = (): boolean => styleText('red', '-') !== '-';

/**
 * Renders the lines of `source` around `location`, with carets under the located text and
 * `message` after the last caret.
 *
 * Lines and columns are 1-based and `end` is exclusive, as in momoa's locations. Without
 * `end`, a single caret marks `start`.
 */
export default function codeFrame(
  source: string,
  { start, end = start }: { start: Position; end?: Position },
  { message, color = supportsColor() }: { message?: string; color?: boolean } = {}
): string {
  const paint: Paint = color
    ? (format, text) => styleText(format, text, { validateStream: false })
    : (_format, text) => text;

  const lines = source.split(NEWLINE);
  const markers = getMarkers(lines, start, end);
  const first = Math.max(start.line - LINES_ABOVE, 1);
  const last = Math.min(end.line + LINES_BELOW, lines.length);
  const width = String(last).length;

  const rows = [];
  for (let number = first; number <= last; number++) {
    const line = lines[number - 1];
    const gutter = ` ${String(number).padStart(width)} |`;
    const code = line.length > 0 ? ` ${color ? highlight(line, paint) : line}` : '';
    const marker = markers.get(number);
    if (!marker) {
      rows.push(` ${paint('gray', gutter)}${code}`);
      continue;
    }

    const [column, count] = marker;
    const spacing = line.slice(0, column - 1).replace(/[^\t]/g, ' ');
    let caretRow = ` ${paint('gray', gutter.replace(/\d/g, ' '))} ${spacing}${paint(MARKER_STYLE, '^'.repeat(count))}`;
    if (message && number === end.line) {
      caretRow += ` ${paint(MARKER_STYLE, message)}`;
    }
    rows.push(`${paint(MARKER_STYLE, '>')}${paint('gray', gutter)}${code}`, caretRow);
  }

  return rows.join('\n');
}

// Maps each marked line number to the column of its first caret and the number of carets.
function getMarkers(
  lines: string[],
  start: Position,
  end: Position
): Map<number, [column: number, count: number]> {
  const markers = new Map<number, [column: number, count: number]>();
  if (start.line === end.line) {
    markers.set(start.line, [start.column, Math.max(end.column - start.column, 1)]);
    return markers;
  }

  markers.set(start.line, [start.column, lines[start.line - 1].length - start.column + 1]);
  for (let number = start.line + 1; number < end.line; number++) {
    markers.set(number, [1, Math.max(lines[number - 1].length, 1)]);
  }
  markers.set(end.line, [1, end.column - 1]);
  return markers;
}

// JSON strings can't contain raw line breaks, so each line holds whole tokens.
function highlight(line: string, paint: Paint): string {
  let output = '';
  let offset = 0;
  for (const { type, loc } of tokenize(line)) {
    const style = TOKEN_STYLES[type];
    if (style) {
      output +=
        line.slice(offset, loc.start.offset) +
        paint(style, line.slice(loc.start.offset, loc.end.offset));
      offset = loc.end.offset;
    }
  }
  return output + line.slice(offset);
}
