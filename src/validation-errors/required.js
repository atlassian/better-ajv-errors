import chalk from 'chalk';
import jestDiff from 'jest-diff';
import pointer from 'jsonpointer';

import BaseValidationError from './base';

export default class RequiredValidationError extends BaseValidationError {
  print(schema, data) {
    const output = [];
    const { message, dataPath, params } = this.options;
    output.push(chalk`{red {bold REQUIRED} ${message}}\n`);
    const expected = JSON.parse(JSON.stringify(data));
    /**
     * JSON Pointers version doesn't differentiate between normal and object
     * props like `params` vs `.params`
     */
    pointer.set(expected, `${dataPath}/${params.missingProperty}`, 'required');

    return output.concat(
      jestDiff(data, expected, {
        expand: false,
        aAnnotation: 'Extra',
        bAnnotation: 'Missing',
      })
    );
  }
}
