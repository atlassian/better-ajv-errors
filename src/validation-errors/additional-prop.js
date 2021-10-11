import chalk from 'chalk';
import BaseValidationError from './base';

export default class AdditionalPropValidationError extends BaseValidationError {
  constructor(...args) {
    super(...args);
    this.name = 'AdditionalPropValidationError';
    this.options.isIdentifierLocation = true;
  }

  print() {
    const { message, dataPath, params } = this.options;
    const output = [chalk`{red {bold ADDTIONAL PROPERTY} ${message}}\n`];

    return output.concat(
      this.getCodeFrame(
        chalk`😲  {magentaBright ${params.additionalProperty}} is not expected to be here!`,
        `${dataPath}/${params.additionalProperty}`
      )
    );
  }

  getError() {
    const { params, dataPath } = this.options;

    return {
      ...this.getLocation(`${dataPath}/${params.additionalProperty}`),
      error: `${this.getDecoratedPath(dataPath)} Property ${params.additionalProperty} is not expected to be here`,
      path: dataPath,
    };
  }
}
