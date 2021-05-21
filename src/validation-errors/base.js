import { codeFrameColumns } from '@babel/code-frame';
import { getMetaFromPath, getDecoratedDataPath } from '../json';

export default class BaseValidationError {
  constructor(
    options = { isIdentifierLocation: false },
    { data, schema, jsonAst, jsonRaw }
  ) {
    this.options = options;
    this.data = data;
    this.schema = schema;
    this.jsonAst = jsonAst;
    this.jsonRaw = jsonRaw;
  }

  getLocation(dataPath = this.instancePath) {
    const { isIdentifierLocation, isSkipEndLocation } = this.options;
    const { loc } = getMetaFromPath(
      this.jsonAst,
      dataPath,
      isIdentifierLocation
    );
    return {
      start: loc.start,
      end: isSkipEndLocation ? undefined : loc.end,
    };
  }

  getDecoratedPath(dataPath = this.instancePath) {
    const decoratedPath = getDecoratedDataPath(this.jsonAst, dataPath);
    return decoratedPath;
  }

  getCodeFrame(message, dataPath = this.instancePath) {
    return codeFrameColumns(this.jsonRaw, this.getLocation(dataPath), {
      highlightCode: true,
      message,
    });
  }

  /**
   * @return {string}
   */
  get instancePath() {
    return typeof this.options.instancePath !== 'undefined'
      ? this.options.instancePath
      : this.options.dataPath;
  }

  print() {
    throw new Error(
      `Implement the 'print' method inside ${this.constructor.name}!`
    );
  }

  getError() {
    throw new Error(
      `Implement the 'getError' method inside ${this.constructor.name}!`
    );
  }
}
