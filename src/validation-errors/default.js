import chalk from 'chalk';
import printJson from '../json/print';
import BaseValidationError from './base';
import findErrorPosition from '../json/find-error-position';

export default class DefaultValidationError extends BaseValidationError {
  print(schema, data) {
    const output = [];
    const { keyword, message, dataPath, params } = this.options;
    output.push(chalk`{red {bold ${keyword}} ${message}}\n`);

    return output.concat(
      printJson(data, dataPath, { indent: this.indent })(() => {
        return chalk`☝🏽  ${keyword} ${message}`;
      })
    );
  }

  getError(schema, data) {
    const { keyword, message, dataPath, params } = this.options;
    const { line, column } = findErrorPosition(data, dataPath, this.indent);

    return {
      line,
      column,
      error: `${dataPath}: ${keyword} ${message}`,
    };
  }
}
