import { bold, red, magenta } from 'kleur/colors';
import BaseValidationError from './base';

const REQUIRED = bold('REQUIRED');

export default class RequiredValidationError extends BaseValidationError {
  getLocation(dataPath = this.instancePath) {
    const { start } = super.getLocation(dataPath);
    return { start };
  }

  print() {
    const { message, params } = this.options;
    const line = red(`${REQUIRED} ${message}`);
    const output = [`${line}\n`];

    return output.concat(
      this.getCodeFrame(`${magenta(params.missingProperty)} is missing here!`)
    );
  }

  getError() {
    const { message } = this.options;

    return {
      ...this.getLocation(),
      error: `${this.getDecoratedPath()} ${message}`,
      path: this.instancePath,
    };
  }
}
