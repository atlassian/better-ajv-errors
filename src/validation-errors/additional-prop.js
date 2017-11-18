import chalk from 'chalk';
import printJson from '../json/print';
import findErrorPosition from '../json/find-error-position';
import BaseValidationError from './base';

export default class AdditionalPropValidationError extends BaseValidationError {
  print(schema, data) {
    const output = [];
    const { message, dataPath, params } = this.options;
    output.push(chalk`{red {bold ADDTIONAL PROPERTY} ${message}}\n`);

    return output.concat(
      printJson(data, `${dataPath}/${params.additionalProperty}`, { indent: this.indent })(() => {
        return chalk`😲  {bold ${params.additionalProperty}} is not expected to be here!`;
      })
    );
    return [];

    // const expected = JSON.parse(JSON.stringify(data));
    // pointer.set(
    //   expected,
    //   `${dataPath}/${params.additionalProperty}`,
    //   undefined
    // );
    //
    // return output.concat(
    //   jestDiff(data, expected, {
    //     expand: false,
    //     aAnnotation: 'Extra',
    //     bAnnotation: 'Missing',
    //   })
    // );
  }

  getError(schema, data) {
    const { keyword, message, dataPath, params } = this.options;
    const jsonString = JSON.stringify(data, null, this.indent);
    const { line, column } = findErrorPosition(jsonString, dataPath);

    return {
      line,
      column,
      error: `Property ${params.additionalProperty} is not expected to be here`,
    };
  }
}
