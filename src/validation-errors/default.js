import { styleText } from 'node:util';
import BaseValidationError from './base';

export default class DefaultValidationError extends BaseValidationError {
  print() {
    const { keyword, message } = this.options;
    const output = [
      styleText('red', styleText('bold', keyword.toUpperCase()) + ' ' + message) + '\n',
    ];

    return output.concat(
      this.getCodeFrame(
        '👈🏽  ' + styleText('magentaBright', keyword) + ' ' + message
      )
    );
  }

  getError() {
    const { keyword, message } = this.options;

    return {
      ...this.getLocation(),
      error: `${this.getDecoratedPath()}: ${keyword} ${message}`,
      path: this.instancePath,
    };
  }
}
