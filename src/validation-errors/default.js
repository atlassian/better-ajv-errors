import { styleText } from 'node:util';

import BaseValidationError from './base';

export default class DefaultValidationError extends BaseValidationError {
  print() {
    const { keyword, message } = this.options;
		const boldUpperKeyword = styleText('bold', keyword.toUpperCase());
		const magentaBrightKeyword = styleText('magentaBright', keyword);

    return [
			styleText('red', `${boldUpperKeyword} ${message}\n`),
      this.getCodeFrame(`👈🏽  ${magentaBrightKeyword} ${message}`)
		];
  }

  getError() {
    const { keyword, message } = this.options;

    return {
      ...this.getLocation(),
      error: `${this.getDecoratedPath()}: ${keyword} ${message}`,
      path: this.instancePath,
    };
  }
}
