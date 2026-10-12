import { styleText } from 'node:util';
import pointer from 'jsonpointer';
import type { IOutputError } from '../index';
import levenshtein from '../levenshtein';
import type { EnumParams } from '../types';
import BaseValidationError from './base';

// Allowed values print as `String()` prints them, so an array prints its items joined by commas.
// oxlint-disable-next-line typescript/no-base-to-string
const toText = (value: unknown): string => String(value);

export default class EnumValidationError extends BaseValidationError<EnumParams> {
  print(): string[] {
    const {
      message,
      params: { allowedValues },
    } = this.options;
    const bestMatch = this.findBestMatch();

    // Needed to handle nullable enums, as joining on null just prints ", "
    const [firstValue, ...rest] = allowedValues;
    const allowedValuesMessage = rest.reduce<string>(
      (acc, value) => `${acc}, ${toText(value)}`,
      toText(firstValue || '')
    );

    const output = [
      styleText('red', styleText('bold', 'ENUM') + ' ' + message),
      styleText('red', `(${allowedValuesMessage})\n`),
    ];

    return output.concat(
      this.getCodeFrame(
        bestMatch !== null
          ? '👈🏽  Did you mean ' + styleText('magentaBright', toText(bestMatch)) + ' here?'
          : '👈🏽  Unexpected value, should be equal to one of the allowed values'
      )
    );
  }

  getError(): IOutputError {
    const { message, params } = this.options;
    const bestMatch = this.findBestMatch();
    const allowedValues = params.allowedValues.join(', ');

    const output: IOutputError = {
      ...this.getLocation(),
      error: this.withDecoratedPath(`${message}: ${allowedValues}`),
      path: this.instancePath,
    };

    if (bestMatch !== null) {
      output.suggestion = `Did you mean ${toText(bestMatch)}?`;
    }

    return output;
  }

  findBestMatch(): unknown {
    const {
      params: { allowedValues },
    } = this.options;

    const currentValue =
      this.instancePath === '' ? this.data : pointer.get(this.data as object, this.instancePath);

    if (!currentValue) {
      return null;
    }

    const bestMatch = allowedValues
      .map(value => ({
        value,
        // Only strings are compared, so other allowed values cannot be a close match.
        weight: typeof value === 'string' ? levenshtein(value, toText(currentValue)) : Infinity,
      }))
      .sort((x, y) => (x.weight > y.weight ? 1 : x.weight < y.weight ? -1 : 0))[0];

    return allowedValues.length === 1 ||
      (typeof bestMatch.value === 'string' && bestMatch.weight < bestMatch.value.length)
      ? bestMatch.value
      : null;
  }
}
