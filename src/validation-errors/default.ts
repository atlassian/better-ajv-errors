import { styleText } from 'node:util';
import type { IOutputError } from '../index';
import BaseValidationError from './base';

const PREDICATE_KEYWORDS = new Set(['dependencies']);

export default class DefaultValidationError extends BaseValidationError {
  print(): string[] {
    const { keyword, message } = this.options;
    const output = [
      styleText('red', styleText('bold', keyword.toUpperCase()) + ' ' + message) + '\n',
    ];

    const label = PREDICATE_KEYWORDS.has(keyword)
      ? message
      : `${styleText('magentaBright', keyword)} ${message}`;

    return output.concat(this.getCodeFrame(`👈🏽  ${label}`));
  }

  getError(): IOutputError {
    const { keyword, message } = this.options;
    const errorMsg = PREDICATE_KEYWORDS.has(keyword) ? (message ?? '') : `${keyword} ${message}`;

    return {
      ...this.getLocation(),
      error: this.withDecoratedPath(errorMsg, ': '),
      path: this.instancePath,
    };
  }
}
