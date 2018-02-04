import { codeFrameColumns } from '@babel/code-frame';
import { getMetaFromPath } from '../json';

export default class BaseValidationError {
  constructor(
    options = { isIdentifierLocation: false, isSkipEndLocation: false },
    { data, schema, jsonAst, jsonRaw }
  ) {
    this.options = options;
    this.data = data;
    this.schema = schema;
    this.jsonAst = jsonAst;
    this.jsonRaw = jsonRaw;
  }

  getLocation(dataPath = this.options.dataPath) {
    const { isIdentifierLocation, isSkipEndLocation } = this.options;
    const { loc } = getMetaFromPath(
      this.jsonAst,
      dataPath,
      isIdentifierLocation
    );
    return isSkipEndLocation ? { ...loc, end: undefined } : loc;
  }

  getCodeFrame(message, dataPath = this.options.dataPath) {
    return codeFrameColumns(this.jsonRaw, this.getLocation(dataPath), {
      highlightCode: true,
      message,
    });
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
