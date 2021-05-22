import chalk from 'chalk';
import BaseValidationError from './base';

export default class DefaultValidationError extends BaseValidationError {
  print() {
    const { keyword, message } = this.options;
    const output = [chalk`{red {bold ${keyword.toUpperCase()}} ${message}}\n`];

    return output.concat(
      this.getCodeFrame(chalk`👈🏽  {magentaBright ${keyword}} ${message}`)
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
