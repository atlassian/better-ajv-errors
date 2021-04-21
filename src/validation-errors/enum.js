import leven from 'leven';
import BaseValidationError from './base';

export default class EnumValidationError extends BaseValidationError {
  getError() {
    const { message, instancePath, params } = this.options;
    const bestMatch = this.findBestMatch();

    const output = {
      error: `${this.getPrettyPropertyName(
        instancePath,
      )} ${message}: ${params.allowedValues
        .map(value =>
          typeof value === 'string' ? `\`${value}\`` : JSON.stringify(value),
        )
        .join(', ')}`,
      path: instancePath,
    };

    if (bestMatch !== null) {
      output.suggestion = `Did you mean \`${bestMatch}\`?`;
    }

    return output;
  }

  findBestMatch() {
    const {
      instancePath,
      params: { allowedValues },
    } = this.options;

    const currentValue = this.getPropertyValue(instancePath);

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
      return null;
    }

    const bestMatch = matches[0];

    return allowedValues.length === 1 ||
      bestMatch.weight < bestMatch.value.length
      ? bestMatch.value
      : null;
  }
}
