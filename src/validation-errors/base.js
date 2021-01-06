import { codeFrameColumns } from '@babel/code-frame';
import { getMetaFromPath, getDecoratedDataPath } from '../json';
import chalk from 'chalk';

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

  getLocation(dataPath = this.options.dataPath) {
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

  getDecoratedPath(dataPath = this.options.dataPath) {
    const decoratedPath = getDecoratedDataPath(this.jsonAst, dataPath);
    return decoratedPath;
  }

  getCodeFrame(message, dataPath = this.options.dataPath) {
    const formattedDataPath = dataPath
      ? chalk`\n\n    {yellow @} {grey ${dataPath}}`
      : '';
    const codeFrame = codeFrameColumns(
      this.jsonRaw,
      this.getLocation(dataPath),
      {
        highlightCode: true,
        message,
      }
    );

    return codeFrame + formattedDataPath;
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
