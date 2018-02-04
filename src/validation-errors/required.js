import chalk from 'chalk';
import BaseValidationError from './base';

export default class RequiredValidationError extends BaseValidationError {
  constructor(...args) {
    super(...args);
    this.options.isSkipEndLocation = true;
  }

  print() {
    const { message, params } = this.options;
    const output = [chalk`{red {bold REQUIRED} ${message}}\n`];

    return output.concat(
      this.getCodeFrame(
        chalk`☹️  {green ${params.missingProperty}} is missing here!`
      )
    );
  }

  getError() {
    const { params } = this.options;
    const { line, column } = this.getLocation();

    return {
      line,
      column,
      error: `Required property ${params.missingProperty} is missing`,
    };
  }
}
