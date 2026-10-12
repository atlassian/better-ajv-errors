import { styleText } from 'node:util';
import type { IOutputError } from '../index';
import type { AdditionalPropertiesParams, ErrorContext } from '../types';
import BaseValidationError, { type ValidationErrorOptions } from './base';

export default class AdditionalPropValidationError extends BaseValidationError<AdditionalPropertiesParams> {
  constructor(options: ValidationErrorOptions<AdditionalPropertiesParams>, context: ErrorContext) {
    super(options, context);
    this.options.isIdentifierLocation = true;
  }

  print(): string[] {
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
  get additionalPropertyPath(): string {
    const property = this.options.params.additionalProperty
      .replace(/~/g, '~0')
      .replace(/\//g, '~1');
    return `${this.instancePath}/${property}`;
  }

  getError(): IOutputError {
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
