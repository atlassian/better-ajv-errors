import BaseValidationError from './base';

export default class TypeValidationError extends BaseValidationError {
  getError() {
    const { message, dataPath } = this.options;

    const propertyName = this.getPropertyName(dataPath);

    return {
      error:
        propertyName === null
          ? `Value type ${message}`
          : `\`${propertyName}\` property type ${message}`,
      path: dataPath,
    };
  }
}
