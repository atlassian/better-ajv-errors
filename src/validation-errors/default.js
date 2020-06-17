import BaseValidationError from './base';
import { cleanAjvMessage } from './utils';

export default class DefaultValidationError extends BaseValidationError {
  getError() {
    const { message, dataPath } = this.options;

    return {
      error: `${this.getPrettyPropertyName(dataPath)} ${cleanAjvMessage(
        message,
      )}`,
      path: dataPath,
    };
  }
}
