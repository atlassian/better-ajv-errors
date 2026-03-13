import chalk from 'chalk';
import leven from 'leven';
import pointer from 'jsonpointer';
import BaseValidationError from './base';

export default class EnumValidationError extends BaseValidationError {
  print() {
    const {
      message,
      params: { allowedValues },
    } = this.options;
    const bestMatch = this.findBestMatch();

		// Needed to handle nullable enums, as joining on null just prints ", "
		const [firstValue, ...rest] = allowedValues;
		const allowedValuesMessage = rest.reduce(
			(acc, value) => `, ${value}`,
			firstValue ?? '',
		);

    const output = [
      chalk`{red {bold ENUM} ${message}}`,
      chalk`{red (${allowedValuesMessage})}\n`,
    ];

    return output.concat(
      this.getCodeFrame(
        bestMatch !== null
          ? chalk`👈🏽  Did you mean {magentaBright ${bestMatch}} here?`
          : chalk`👈🏽  Unexpected value, should be equal to one of the allowed values`
      )
    );
  }

  getError() {
    const { message, params } = this.options;
    const bestMatch = this.findBestMatch();
    const allowedValues = params.allowedValues.join(', ');

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
