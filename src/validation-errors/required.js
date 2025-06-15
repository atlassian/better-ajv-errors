import chalk from 'chalk';
import BaseValidationError from './base';

export default class RequiredValidationError extends BaseValidationError {
  getLocation(dataPath = this.instancePath) {
    const { start } = super.getLocation(dataPath);
    return { start };
  }

  print() {
    const { message, params } = this.options;
    const output = [chalk`{red {bold REQUIRED} ${message}}\n`];

    return output.concat(
      this.getCodeFrame(
        chalk`${this.showEmoji('☹️')}{magentaBright ${
          params.missingProperty
        }} is missing here!`
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
