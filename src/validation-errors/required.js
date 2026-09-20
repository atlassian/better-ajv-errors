import BaseValidationError from './base';
import { style } from './style';

export default class RequiredValidationError extends BaseValidationError {
  getLocation(dataPath = this.instancePath) {
    const { start } = super.getLocation(dataPath);
    return { start };
  }

  print() {
    const { message, params } = this.options;
    const output = [
      `${style('red', `${style('bold', 'REQUIRED')} ${message}`)}\n`,
    ];

    return output.concat(
      this.getCodeFrame(
        `☹️  ${style('magentaBright', params.missingProperty)} is missing here!`
      )
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
