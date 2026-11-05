import { styleText } from 'node:util';
import type { IOutputError } from '../index';
import type { ConstParams } from '../types';
import BaseValidationError from './base';

// The allowed value is printed as JSON so a string is quoted and tells the reader
// that the schema expects exactly that text.
const toText = (value: unknown): string => JSON.stringify(value) ?? String(value);

export default class ConstValidationError extends BaseValidationError<ConstParams> {
  print(): string[] {
    const {
      message,
      params: { allowedValue },
    } = this.options;

    const output = [
      styleText('red', styleText('bold', 'CONST') + ' ' + message),
      styleText('red', `(${toText(allowedValue)})\n`),
    ];

    return output.concat(
      this.getCodeFrame(
        '👈🏽  Should be equal to ' + styleText('magentaBright', toText(allowedValue))
      )
    );
  }

  getError(): IOutputError {
    const {
      message,
      params: { allowedValue },
    } = this.options;

    return {
      ...this.getLocation(),
      error: this.withDecoratedPath(`${message}: ${toText(allowedValue)}`),
      path: this.instancePath,
    };
  }
}
