import chalk from 'chalk';
import BaseValidationError from './base';

export default class RequiredValidationError extends BaseValidationError {
  getLocation(dataPath = this.options.dataPath) {
    const { start } = super.getLocation(dataPath);
    return { start };
  }

  print() {
    const { message, params } = this.options;
    const output = [chalk`{red {bold REQUIRED} ${message}}\n`];

    return output.concat(
      this.getCodeFrame(
        chalk`☹️  {magentaBright ${params.missingProperty}} is missing here!`
      )
    );
  }

  getError() {
    const { params } = this.options;

    return {
      ...this.getLocation(),
      error: `Required property ${params.missingProperty} is missing`,
    };
  }
}
