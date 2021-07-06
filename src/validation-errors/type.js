import BaseValidationError from './base';

export default class TypeValidationError extends BaseValidationError {
  getError() {
    const { message, instancePath } = this.options;

    const propertyName = this.getPropertyName(instancePath);

    return {
      error:
        propertyName === null
          ? `Value type ${message}`
          : `"${propertyName}" property type ${message}`,
      path: instancePath,
    };
  }
}
