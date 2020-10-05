import chalk from 'chalk';
import leven from 'leven';
import pointer from 'jsonpointer';
import BaseValidationError from './base';

function printAllowedValues(allowedValues) {
  return allowedValues
    .map(value =>
      value === null || value === undefined ? String(value) : value
    )
    .join(', ');
}

export default class EnumValidationError extends BaseValidationError {
  print() {
    const {
      message,
      params: { allowedValues },
    } = this.options;
    const bestMatch = this.findBestMatch();

    const output = [
      chalk`{red {bold ENUM} ${message}}`,
      chalk`{red (${printAllowedValues(allowedValues)})}\n`,
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
    const { message, dataPath, params } = this.options;
    const bestMatch = this.findBestMatch();

    const output = {
      ...this.getLocation(),
      error: `${this.getDecoratedPath(
        dataPath
      )} ${message}: ${printAllowedValues(params.allowedValues)}`,
      path: dataPath,
    };

    if (bestMatch !== null) {
      output.suggestion = `Did you mean ${bestMatch}?`;
    }

    return output;
  }

  findBestMatch() {
    const {
      dataPath,
      params: { allowedValues },
    } = this.options;

    const currentValue =
      dataPath === '' ? this.data : pointer.get(this.data, dataPath);

    if (typeof currentValue !== 'string') {
      return null;
    }

    const matches = allowedValues
      .filter(value => typeof value === 'string')
      .map(value => ({
        value,
        weight: leven(value, currentValue.toString()),
      }))
      .sort((x, y) => (x.weight > y.weight ? 1 : x.weight < y.weight ? -1 : 0));

    if (matches.length === 0) {
      return;
    }

    const bestMatch = matches[0];

    return allowedValues.length === 1 ||
      bestMatch.weight < bestMatch.value.length
      ? bestMatch.value
      : null;
  }
}
