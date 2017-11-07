import chalk from 'chalk';
import printJson from '../json/print';
import BaseValidationError from './base';

export default class DefaultValidationError extends BaseValidationError {
  print(schema, data) {
    const output = [];
    const { keyword, message, dataPath, params } = this.options;
    output.push(chalk`{red {bold ${keyword}} ${message}}\n`);

    return output.concat(
      printJson(data, dataPath)(() => {
        return chalk`☝🏽  ${keyword} ${message}`;
      })
    );
  }
}
