import chalk from 'chalk';
import BaseValidationError from './base';

export class ArrayPropertyValidationError extends BaseValidationError {
  print() {
    const { message } = this.options;
    const displayPath = this.instancePath.length === 0 ? '/' : this.instancePath;

    const output = [chalk`{red {bold ${displayPath}} ${message}}\n`];

    return output.concat(
      this.getCodeFrame(chalk`👈🏽  {magentaBright array} ${message}`)
    );
  }

  getError() {
    const { message } = this.options;
    const decoratedPath = this.getDecoratedPath();
    const displayPath = decoratedPath.length === 0 ? '/' : decoratedPath;

    return {
      ...this.getLocation(),
      error: `${displayPath}: Array ${message}`,
      path: this.instancePath,
    };
  }
}
