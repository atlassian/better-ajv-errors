import BaseValidationError from './base';

export default class DefaultValidationError extends BaseValidationError {
  getError() {
    const { keyword, message, dataPath } = this.options;

    return {
      ...this.getLocation(),
      error: `${this.getDecoratedPath(dataPath)}: ${keyword} ${message}`,
      path: dataPath,
    };
  }
}
