import { bold, red, magenta } from 'kleur/colors';
import BaseValidationError from './base';

const ADDITIONAL_PROPERTY = bold('ADDITIONAL PROPERTY');

export default class AdditionalPropValidationError extends BaseValidationError {
  constructor(...args) {
    super(...args);
    this.options.isIdentifierLocation = true;
  }

  print() {
    const { message, params } = this.options;
    const line = red(`${ADDITIONAL_PROPERTY} ${message}`);
    const output = [`${line}\n`];

    return output.concat(
      this.getCodeFrame(
        `${magenta(params.additionalProperty)} is not expected to be here!`,
        `${this.instancePath}/${params.additionalProperty}`
      )
    );
  }

  getError() {
    const { params } = this.options;

    return {
      ...this.getLocation(`${this.instancePath}/${params.additionalProperty}`),
      error: `${this.getDecoratedPath()} Property ${
        params.additionalProperty
      } is not expected to be here`,
      path: this.instancePath,
    };
  }
}
