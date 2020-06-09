import BaseValidationError from './base';

export default class RequiredValidationError extends BaseValidationError {
  getLocation(dataPath = this.options.dataPath) {
    const { start } = super.getLocation(dataPath);
    return { start };
  }

  getError() {
    const { message, dataPath } = this.options;

    return {
      ...this.getLocation(),
      error: `${this.getDecoratedPath(dataPath)} ${message}`,
      path: dataPath,
    };
  }
}
