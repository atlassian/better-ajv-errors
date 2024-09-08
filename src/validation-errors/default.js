import { bold, red, magenta } from 'kleur/colors';
import BaseValidationError from './base';

export default class DefaultValidationError extends BaseValidationError {
  print() {
    const { keyword, message } = this.options;
    const line = red(`${bold(keyword.toUpperCase())} ${message}`);
    const output = [`${line}}\n`];

    return output.concat(this.getCodeFrame(`${magenta(keyword)} ${message}`));
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
