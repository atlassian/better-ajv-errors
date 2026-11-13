import { styleText } from 'node:util';
import type { IOutputError } from '../index';
import type {
  AdditionalPropertiesParams,
  ErrorContext,
  UnevaluatedPropertiesParams,
} from '../types';
import BaseValidationError, { type ValidationErrorOptions } from './base';

export default class AdditionalPropValidationError extends BaseValidationError<
  AdditionalPropertiesParams | UnevaluatedPropertiesParams
> {
  constructor(
    options: ValidationErrorOptions<AdditionalPropertiesParams | UnevaluatedPropertiesParams>,
    context: ErrorContext
  ) {
    super(options, context);
    this.options.isIdentifierLocation = true;
  }

  get propertyName(): string {
    const params = this.options.params;
    return 'additionalProperty' in params ? params.additionalProperty : params.unevaluatedProperty;
  }

  print(): string[] {
    const { message, keyword } = this.options;
    const headerTitle =
      keyword === 'unevaluatedProperties' ? 'UNEVALUATED PROPERTY' : 'ADDITIONAL PROPERTY';
    const output = [styleText('red', styleText('bold', headerTitle) + ' ' + message) + '\n'];

    return output.concat(
      this.getCodeFrame(
        '😲  ' + styleText('magentaBright', this.propertyName) + ' is not expected to be here!',
        this.additionalPropertyPath
      )
    );
  }

  // The property name has to be escaped before it is appended to the JSON pointer.
  get additionalPropertyPath(): string {
    const property = this.propertyName.replace(/~/g, '~0').replace(/\//g, '~1');
    return `${this.instancePath}/${property}`;
  }

  getError(): IOutputError {
    return {
      ...this.getLocation(this.additionalPropertyPath),
      error: this.withDecoratedPath(`Property ${this.propertyName} is not expected to be here`),
      path: this.instancePath,
    };
  }
}
