import { styleText } from 'node:util';
import BaseValidationError from './base';

export default class UnevaluatedPropValidationError extends BaseValidationError {
  constructor(...args) {
    super(...args);
    this.options.isIdentifierLocation = true;
  }

  print() {
    const { message, params } = this.options;
    const output = [
      styleText('red', styleText('bold', 'UNEVALUATED PROPERTY') + ' ' + message) + '\n',
    ];

    return output.concat(
      this.getCodeFrame(
        '😲  ' +
          styleText('magentaBright', params.unevaluatedProperty) +
          ' is not expected to be here!',
        `${this.instancePath}/${params.unevaluatedProperty}`
      )
    );
  }

  getError() {
    const { params } = this.options;

    return {
      ...this.getLocation(`${this.instancePath}/${params.unevaluatedProperty}`),
      error: this.withDecoratedPath(
        `Property ${params.unevaluatedProperty} is not expected to be here`
      ),
      path: this.instancePath,
    };
  }
}
