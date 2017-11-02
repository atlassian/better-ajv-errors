import chalk from 'chalk';
import jestDiff from 'jest-diff';
import pointer from 'jsonpointer';

import BaseValidationError from './base';

export default class AdditionalPropValidationError extends BaseValidationError {
  print(schema, data) {
    const output = [];
    const { message, dataPath, params } = this.options;
    output.push(chalk`{red {bold ADDTIONAL PROPERTY} ${message}}\n`);

    const expected = JSON.parse(JSON.stringify(data));
    pointer.set(
      expected,
      `${dataPath}/${params.additionalProperty}`,
      undefined
    );

    return output.concat(
      jestDiff(data, expected, {
        expand: false,
        aAnnotation: 'Extra',
        bAnnotation: 'Missing',
      })
    );
  }
}
