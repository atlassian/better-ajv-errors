import chalk from 'chalk';
import leven from 'leven';
import pointer from 'jsonpointer';
import printJson from '../json/print';

import BaseValidationError from './base';

export default class EnumValidationError extends BaseValidationError {
  print(schema, data) {
    const output = [];
    const { message, dataPath, params: { allowedValues } } = this.options;
    output.push(chalk`{red {bold ENUM} ${message}}`);
    output.push(chalk`{red (${allowedValues.join(', ')})}\n`);

    const currentValue = pointer.get(data, dataPath);
    const bestMatch = allowedValues
      .map(value => ({
        value,
        weight: leven(value, currentValue.toString()),
      }))
      .sort(
        (x, y) => (x.weight > y.weight ? 1 : x.weight < y.weight ? -1 : 0)
      )[0];

    return output.concat(
      printJson(data, dataPath, { indent: this.indent })(() => {
        if (allowedValues.length === 1 || bestMatch.weight < 5) {
          return chalk`☝🏽  Did you mean {bold ${bestMatch.value}} here?`;
        } else {
          return chalk`☝🏽  Unexpected value here`;
        }
      })
    );
  }
}
