import BaseValidationError from './base';

export default class AdditionalPropValidationError extends BaseValidationError {
  constructor(...args) {
    super(...args);
  }

  getError() {
    const { params, instancePath } = this.options;

    return {
      error: `Property "${params.additionalProperty}" is not expected to be here`,
      path: instancePath,
    };
  }
}
