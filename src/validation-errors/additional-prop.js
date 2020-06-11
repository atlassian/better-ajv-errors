import BaseValidationError from './base';
import leven from 'leven';
import pointer from 'jsonpointer';

export default class AdditionalPropValidationError extends BaseValidationError {
  constructor(...args) {
    super(...args);
    this.options.isIdentifierLocation = true;
  }

  getError() {
    const { params, dataPath } = this.options;
    const bestMatch = this.findBestMatch();
    //console.log(this.options)
    const output = {
      ...this.getLocation(`${dataPath}/${params.additionalProperty}`),
      error: `${this.getDecoratedPath(dataPath)} Property ${
        params.additionalProperty
      } is not expected to be here`,
      path: dataPath,
      suggestion: `Allowed values are: ${Object.keys(
        this.schema.properties
      ).join(', ')}`,
    };

    if (bestMatch !== null) {
      output.suggestion = `Did you mean '${bestMatch}'? ` + output.suggestion;
    }
    return output;
  }

  findBestMatch() {
    const { params } = this.options;

    const allowedValues = Object.keys(this.schema.properties);
    const currentValue = params.additionalProperty;

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
