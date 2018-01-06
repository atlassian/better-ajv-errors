import chalk from 'chalk';
import leven from 'leven';
import pointer from 'jsonpointer';
import { print as printJson, getMetaFromPath } from '../json';
import BaseValidationError from './base';

export default class EnumValidationError extends BaseValidationError {
  print(schema, data) {
    const output = [];
    const { message, dataPath, params: { allowedValues } } = this.options;
    const bestMatch = this.findBestMatch(data);

    output.push(chalk`{red {bold ENUM} ${message}}`);
    output.push(chalk`{red (${allowedValues.join(', ')})}\n`);

    return output.concat(
      printJson(data, dataPath, { indent: this.indent })(() => {
        if (bestMatch !== null) {
          return chalk`☝🏽  Did you mean {bold ${bestMatch}} here?`;
        } else {
          return chalk`☝🏽  Unexpected value here`;
        }
      })
    );
  }

  getError(schema, data) {
    const { keyword, message, dataPath, params } = this.options;
    const jsonString = JSON.stringify(data, null, this.indent);
    const { line, column } = getMetaFromPath(jsonString, dataPath);
    const bestMatch = this.findBestMatch(data);

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

  findBestMatch(data) {
    const { dataPath, params: { allowedValues } } = this.options;
    const currentValue = pointer.get(data, dataPath);

    const bestMatch = allowedValues
      .map(value => ({
        value,
        weight: leven(value, currentValue.toString()),
      }))
      .sort(
        (x, y) => (x.weight > y.weight ? 1 : x.weight < y.weight ? -1 : 0)
      )[0];

    return allowedValues.length === 1 || bestMatch.weight < 5
      ? bestMatch.value
      : null;
  }
}
