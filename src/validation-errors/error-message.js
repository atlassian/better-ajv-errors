import BaseValidationError from './base';

export default class ErrorMessageError extends BaseValidationError {
  getError() {
    const { message, instancePath } = this.options;

    return {
      error: message,
      path: instancePath,
    };
  }
}
