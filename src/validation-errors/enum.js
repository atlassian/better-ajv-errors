import { styleText } from 'node:util';
import leven from 'leven';
import pointer from 'jsonpointer';
import BaseValidationError from './base';

/**
 * Formats a single value for display in error messages.
 * Converts non-string values to their string representation to avoid
 * null/undefined becoming empty strings in join operations.
 */
const formatValue = value => String(value);

export default class EnumValidationError extends BaseValidationError {
  print() {
    const {
      message,
      params: { allowedValues },
    } = this.options;
    const bestMatch = this.findBestMatch();

    const allowedValuesMessage = allowedValues.map(formatValue).join(', ');

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
    const allowedValues = params.allowedValues.map(formatValue).join(', ');

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
        weight:
          typeof value === 'string' ? leven(String(value), currentValue.toString()) : Infinity,
      }))
      .sort((x, y) => (x.weight > y.weight ? 1 : x.weight < y.weight ? -1 : 0))[0];

    return typeof bestMatch.value === 'string' && bestMatch.weight < bestMatch.value.length
      ? bestMatch.value
      : null;
  }
}
