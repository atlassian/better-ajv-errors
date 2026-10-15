import { styleText } from 'node:util';
import BaseValidationError from './base';

export default class AdditionalPropValidationError extends BaseValidationError {
  constructor(...args) {
    super(...args);
    this.options.isIdentifierLocation = true;
  }

  print() {
    const { message, params } = this.options;
    const output = [
      styleText('red', styleText('bold', 'ADDITIONAL PROPERTY') + ' ' + message) + '\n',
    ];

    return output.concat(
      this.getCodeFrame(
        '😲  ' +
          styleText('magentaBright', params.additionalProperty) +
          ' is not expected to be here!',
        this.additionalPropertyPath
      )
    );
  }

  // The property name has to be escaped before it is appended to the JSON pointer.
  get additionalPropertyPath() {
    const property = this.options.params.additionalProperty
      .replace(/~/g, '~0')
      .replace(/\//g, '~1');
    return `${this.instancePath}/${property}`;
  }

  getError() {
    const { params } = this.options;

    return {
      ...this.getLocation(this.additionalPropertyPath),
      error: this.withDecoratedPath(
        `Property ${params.additionalProperty} is not expected to be here`
      ),
      path: this.instancePath,
    };
  }
}
