import BaseValidationError from './base';
import { style } from './style';

export default class DefaultValidationError extends BaseValidationError {
  print() {
    const { keyword, message } = this.options;
    const output = [
      `${style('red', `${style('bold', keyword.toUpperCase())} ${message}`)}\n`,
    ];

    return output.concat(
      this.getCodeFrame(`👈🏽  ${style('magentaBright', keyword)} ${message}`)
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
