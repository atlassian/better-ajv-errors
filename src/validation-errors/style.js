import { styleText } from 'node:util';

/**
 * Applies one or more formats to a string using Node's built-in
 * `util.styleText`. Accepts a single format or an array of formats,
 * e.g. `style('red', 'Oops')` or `style(['red', 'bold'], 'Oops')`.
 */
export const style = (formats, text) =>
  styleText(Array.isArray(formats) ? formats : [formats], text);
