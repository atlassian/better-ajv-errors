import BaseValidationError from './base';

export default class AdditionalPropValidationError extends BaseValidationError {
  constructor(...args) {
    super(...args);
    this.name = 'AdditionalPropValidationError';
    this.options.isIdentifierLocation = true;
  }

  print() {
    const { message, params } = this.options;
    const chalk = this.getChalk();
    const output = [chalk`{red {bold ADDTIONAL PROPERTY} ${message}}\n`];

    return output.concat(
      this.getCodeFrame(
        chalk`😲  {magentaBright ${params.additionalProperty}} is not expected to be here!`,
        `${this.instancePath}/${params.additionalProperty}`
      )
    );
  }

  getError() {
    const { params } = this.options;

    return {
      ...this.getLocation(`${this.instancePath}/${params.additionalProperty}`),
      error: `${this.getDecoratedPath()} Property ${params.additionalProperty} is not expected to be here`,
      path: this.instancePath,
    };
  }
}
