import chalk from 'chalk';
import leven from 'leven';
import pointer from 'jsonpointer';
import BaseValidationError from './base';

export default class EnumValidationError extends BaseValidationError {
  print() {
    const { message, params: { allowedValues } } = this.options;
    const bestMatch = this.findBestMatch();

    const output = [
      chalk`{red {bold ENUM} ${message}}`,
      chalk`{red (${allowedValues.join(', ')})}\n`,
    ];

    return output.concat(
      this.getCodeFrame(
        bestMatch !== null
          ? chalk`👈🏽  Did you mean {green ${bestMatch}} here?`
          : chalk`☝🏽  Unexpected value, should be equal to one of the allowed values`
      )
    );
  }

  getError() {
    const { message, dataPath, params } = this.options;
    const { line, column } = this.getLocation();
    const bestMatch = this.findBestMatch();

    const output = {
      line,
      column,
      error: `${dataPath} ${message}: ${params.allowedValues.join(', ')}`,
    };

    if (bestMatch !== null) {
      output.suggestion = `Did you mean ${bestMatch}?`;
    }

    return output;
  }

  findBestMatch() {
    const { dataPath, params: { allowedValues } } = this.options;
    const currentValue = pointer.get(this.data, dataPath);

    if (!currentValue) {
      return null;
    }

    const bestMatch = allowedValues
      .map(value => ({
        value,
        weight: leven(value, currentValue.toString()),
      }))
      .sort(
        (x, y) => (x.weight > y.weight ? 1 : x.weight < y.weight ? -1 : 0)
      )[0];

    return allowedValues.length === 1 ||
      bestMatch.weight < bestMatch.value.length
      ? bestMatch.value
      : null;
  }
}
