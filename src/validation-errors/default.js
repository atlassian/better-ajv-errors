import chalk from 'chalk';
import { print as printJson, getMetaFromPath } from '../json';
import BaseValidationError from './base';

export default class DefaultValidationError extends BaseValidationError {
  print(schema, data) {
    const output = [];
    const { keyword, message, dataPath } = this.options;
    output.push(chalk`{red {bold ${keyword}} ${message}}\n`);

    return output.concat(
      printJson(data, dataPath, { indent: this.indent })(() => {
        return chalk`☝🏽  ${keyword} ${message}`;
      })
    );
  }

  getError(schema, data) {
    const { keyword, message, dataPath } = this.options;
    const jsonString = JSON.stringify(data, null, this.indent);
    const { line, column } = getMetaFromPath(jsonString, dataPath);

    return {
      line,
      column,
      error: `${dataPath}: ${keyword} ${message}`,
    };
  }
}
