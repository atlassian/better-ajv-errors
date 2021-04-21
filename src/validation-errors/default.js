import BaseValidationError from './base';
import { cleanAjvMessage } from './utils';

export default class DefaultValidationError extends BaseValidationError {
  getError() {
    const { message, instancePath } = this.options;

    return {
      error: `${this.getPrettyPropertyName(instancePath)} ${cleanAjvMessage(
        message,
      )}`,
      path: instancePath,
    };
  }
}
