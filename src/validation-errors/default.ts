import { styleText } from 'node:util';
import type { IOutputError } from '../index';
import BaseValidationError from './base';

export default class DefaultValidationError extends BaseValidationError {
  print(): string[] {
    const { keyword, message } = this.options;
    const output = [
      styleText('red', styleText('bold', keyword.toUpperCase()) + ' ' + message) + '\n',
    ];

    return output.concat(
      this.getCodeFrame('👈🏽  ' + styleText('magentaBright', keyword) + ' ' + message)
    );
  }

  getError(): IOutputError {
    const { keyword, message } = this.options;

    return {
      ...this.getLocation(),
      error: this.withDecoratedPath(`${keyword} ${message}`, ': '),
      path: this.instancePath,
    };
  }
}
