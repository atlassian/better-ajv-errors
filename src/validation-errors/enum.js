import chalk from 'chalk';
import jestDiff from 'jest-diff';
import pointer from 'jsonpointer';
import leven from 'leven';

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
        weight: leven(value, currentValue),
      }))
      .sort(
        (x, y) => (x.weight > y.weight ? 1 : x.weight < y.weight ? -1 : 0)
      )[0];

    const expected = JSON.parse(JSON.stringify(data));
    if (allowedValues.length === 1 || bestMatch.weight < 5) {
      output.push(chalk`{green Did you mean {bold ${bestMatch.value}}?}\n`);
      pointer.set(expected, `${dataPath}`, bestMatch.value);
    } else {
      pointer.set(expected, `${dataPath}`, '');
    }

    return output.concat(
      jestDiff(expected, data, {
        expand: false,
      })
    );
  }
}
