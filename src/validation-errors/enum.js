import leven from 'leven';
import pointer from 'jsonpointer';
import BaseValidationError from './base';

export default class EnumValidationError extends BaseValidationError {
  getError() {
    const { message, dataPath, params } = this.options;
    const bestMatch = this.findBestMatch();

    const output = {
      ...this.getLocation(),
      error: `${this.getDecoratedPath(
        dataPath
      )} ${message}: ${params.allowedValues.join(', ')}`,
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

    if (!currentValue) {
      return null;
    }

    const bestMatch = allowedValues
      .map(value => ({
        value,
        weight: leven(value, currentValue.toString()),
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
