import { styleText } from 'node:util';
import pointer from 'jsonpointer';
import levenshtein from '../levenshtein';
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
    const allowedValuesMessage = rest.reduce((acc, value) => `${acc}, ${value}`, firstValue || '');

    const output = [
      styleText('red', styleText('bold', 'ENUM') + ' ' + message),
      styleText('red', `(${allowedValuesMessage})\n`),
    ];

    return output.concat(
      this.getCodeFrame(
        bestMatch !== null
          ? '👈🏽  Did you mean ' + styleText('magentaBright', String(bestMatch)) + ' here?'
          : '👈🏽  Unexpected value, should be equal to one of the allowed values'
      )
    );
  }

  getError() {
    const { message, params } = this.options;
    const bestMatch = this.findBestMatch();
    const allowedValues = params.allowedValues.join(', ');

    const output = {
      ...this.getLocation(),
      error: this.withDecoratedPath(`${message}: ${allowedValues}`),
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
      this.instancePath === '' ? this.data : pointer.get(this.data, this.instancePath);

    if (!currentValue) {
      return null;
    }

    const bestMatch = allowedValues
      .map(value => ({
        value,
        // Only strings are compared, so other allowed values cannot be a close match.
        weight: typeof value === 'string' ? levenshtein(value, currentValue.toString()) : Infinity,
      }))
      .sort((x, y) => (x.weight > y.weight ? 1 : x.weight < y.weight ? -1 : 0))[0];

    return allowedValues.length === 1 ||
      (typeof bestMatch.value === 'string' && bestMatch.weight < bestMatch.value.length)
      ? bestMatch.value
      : null;
  }
}
