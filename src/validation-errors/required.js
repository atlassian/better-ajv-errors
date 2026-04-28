import { styleText } from 'node:util';
import BaseValidationError from './base';

export default class RequiredValidationError extends BaseValidationError {
  getLocation(dataPath = this.instancePath) {
    const { start } = super.getLocation(dataPath);
    return { start };
  }

  print() {
    const { message, params } = this.options;

		const boldRequiredLabel = styleText('bold', 'REQUIRED');
		const magentaMissingProperty = styleText(
			'magentaBright',
			params.missingProperty,
		);

    return [
			styleText('red', `${boldRequiredLabel} ${message}\n`),
			this.getCodeFrame(
				`☹️  ${magentaMissingProperty} is missing here!`,
			),
		];
  }

  getError() {
    const { message } = this.options;

    return {
      ...this.getLocation(),
      error: `${this.getDecoratedPath()} ${message}`,
      path: this.instancePath,
    };
  }
}
