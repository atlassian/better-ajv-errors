import BaseValidationError from './base';
import { style } from './style';

export default class AdditionalPropValidationError extends BaseValidationError {
  constructor(...args) {
    super(...args);
    this.options.isIdentifierLocation = true;
  }

  print() {
    const { message, params } = this.options;
    const output = [
      `${style('red', `${style('bold', 'ADDITIONAL PROPERTY')} ${message}`)}\n`,
    ];

    return output.concat(
      this.getCodeFrame(
        `😲  ${style(
          'magentaBright',
          params.additionalProperty
        )} is not expected to be here!`,
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
