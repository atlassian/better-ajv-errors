import chalk from 'chalk';
import jestDiff from 'jest-diff';
import pointer from 'jsonpointer';

import BaseValidationError from './base';

export default class DefaultValidationError extends BaseValidationError {
  print(schema, data) {
    const output = [];
    const { keyword, message, dataPath, params } = this.options;
    output.push(chalk`{red {bold ${keyword}} ${message}}\n`);

    const expected = JSON.parse(JSON.stringify(data));
    pointer.set(expected, `${dataPath}`, '?');

    return output.concat(
      jestDiff(data, expected, {
        expand: false,
      })
    );
  }
}
