import chalk from 'chalk';
import { codeFrameColumns } from '@babel/code-frame';
import { getMetaFromPath, getDecoratedDataPath } from '../json';

export default class BaseValidationError {
  constructor(options = { isIdentifierLocation: false }, { colorize, data, schema, jsonAst, jsonRaw }) {
    this.options = options;
    this.colorize = !!(!!colorize || colorize === undefined);
    this.data = data;
    this.schema = schema;
    this.jsonAst = jsonAst;
    this.jsonRaw = jsonRaw;
  }

  getChalk() {
    return this.colorize ? chalk : new chalk.Instance({ level: 0 });
  }

  getLocation(dataPath = this.instancePath) {
    const { isIdentifierLocation, isSkipEndLocation } = this.options;
    const { loc } = getMetaFromPath(this.jsonAst, dataPath, isIdentifierLocation);
    return {
      start: loc.start,
      end: isSkipEndLocation ? undefined : loc.end,
    };
  }

  getDecoratedPath(dataPath = this.instancePath) {
    return getDecoratedDataPath(this.jsonAst, dataPath);
  }

  getCodeFrame(message, dataPath = this.instancePath) {
    return codeFrameColumns(this.jsonRaw, this.getLocation(dataPath), {
      highlightCode: this.colorize,
      message,
    });
  }

  /**
   * @return {string}
   */
  get instancePath() {
    return typeof this.options.instancePath !== 'undefined' ? this.options.instancePath : this.options.dataPath;
  }

  print() {
    throw new Error(`Implement the 'print' method inside ${this.constructor.name}!`);
  }

  getError() {
    throw new Error(`Implement the 'getError' method inside ${this.constructor.name}!`);
  }
}
