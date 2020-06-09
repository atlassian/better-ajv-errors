import BaseValidationError from './base';

export default class AdditionalPropValidationError extends BaseValidationError {
  constructor(...args) {
    super(...args);
    this.options.isIdentifierLocation = true;
  }

  getError() {
    const { params, dataPath } = this.options;

    return {
      ...this.getLocation(`${dataPath}/${params.additionalProperty}`),
      error: `${this.getDecoratedPath(dataPath)} Property ${
        params.additionalProperty
      } is not expected to be here`,
      path: dataPath,
    };
  }
}
