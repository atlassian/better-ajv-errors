import leven from 'leven';
import { styleText } from 'node:util';
import pointer from 'jsonpointer';
import BaseValidationError from './base';

export default class EnumValidationError extends BaseValidationError {
  print() {
    const {
      message,
      params: { allowedValues },
    } = this.options;
    const bestMatch = this.findBestMatch();
		const codeFrameMessage = bestMatch !== null
			? `👈🏽  Did you mean ${styleText('magentaBright', bestMatch)} here?`
			: '👈🏽  Unexpected value, should be equal to one of the allowed values';

		// Needed to handle nullable enums, as joining on null just prints ", "
		const [firstValue, ...rest] = allowedValues;
		const allowedValuesMessage = rest.reduce(
			(acc, value) => `${acc}, ${value}`,
			firstValue || '',
		);

		const boldEnumLabel = styleText('bold', 'ENUM');

    return [
      styleText('red', `${boldEnumLabel} ${message}`),
      styleText('red', `(${allowedValuesMessage})\n`),
			this.getCodeFrame(codeFrameMessage),
		]
  }

  getError() {
    const { message, params } = this.options;
    const bestMatch = this.findBestMatch();
		const [firstValue, ...rest] = params.allowedValues;
    const allowedValues = rest.reduce(
			(acc, value) => `${acc}, ${value}`,
			firstValue || '',
		);

    const output = {
      ...this.getLocation(),
      error: `${this.getDecoratedPath()} ${message}: ${allowedValues}`,
      path: this.instancePath,
    };

    if (bestMatch !== null) {
      output.suggestion = `Did you mean ${bestMatch}?`;
    }

    return output;
  }

  findBestMatch() {
    const {
      params: { allowedValues },
    } = this.options;

    const currentValue =
      this.instancePath === ''
        ? this.data
        : pointer.get(this.data, this.instancePath);

    if (!currentValue) {
      return null;
    }

    const bestMatch = allowedValues
      .map(value => ({
        value,
        weight: value !== null
					? leven(value, currentValue.toString())
					: Infinity,
      }))
      .sort((x, y) =>
        x.weight > y.weight ? 1 : x.weight < y.weight ? -1 : 0
      )[0];

    return allowedValues.length === 1 ||
      bestMatch.weight < bestMatch.value.length
      ? bestMatch.value
      : null;
  }
}
