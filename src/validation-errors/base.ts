import type { DocumentNode, Location } from '@humanwhocodes/momoa';
import codeFrame from '../code-frame';
import type { IOutputError } from '../index';
import { getMetaFromPath, getDecoratedDataPath } from '../json/index';
import type { AjvError, ErrorContext } from '../types';
import { getInstancePath } from '../utils';

export interface ValidationErrorOptions<Params> extends AjvError<Params> {
  isIdentifierLocation?: boolean;
  isSkipEndLocation?: boolean;
}

export default abstract class BaseValidationError<Params = Record<string, unknown>> {
  options: ValidationErrorOptions<Params>;
  data: unknown;
  schema: unknown;
  jsonAst: DocumentNode;
  jsonRaw: string;

  constructor(
    options: ValidationErrorOptions<Params>,
    { data, schema, jsonAst, jsonRaw }: ErrorContext
  ) {
    this.options = options;
    this.data = data;
    this.schema = schema;
    this.jsonAst = jsonAst;
    this.jsonRaw = jsonRaw;
  }

  getLocation(dataPath: string = this.instancePath): { start: Location; end?: Location } {
    const { isIdentifierLocation, isSkipEndLocation } = this.options;
    const { loc } = getMetaFromPath(this.jsonAst, dataPath, isIdentifierLocation);
    return {
      start: loc.start,
      end: isSkipEndLocation ? undefined : loc.end,
    };
  }

  getDecoratedPath(dataPath: string = this.instancePath): string {
    const decoratedPath = getDecoratedDataPath(this.jsonAst, dataPath);
    return decoratedPath;
  }

  // The decorated path is empty at the root, where the message stands alone.
  withDecoratedPath(message: string, separator = ' '): string {
    const decoratedPath = this.getDecoratedPath();
    return decoratedPath ? `${decoratedPath}${separator}${message}` : message;
  }

  getCodeFrame(message: string, dataPath: string = this.instancePath): string {
    return codeFrame(this.jsonRaw, this.getLocation(dataPath), { message });
  }

  get instancePath(): string {
    return getInstancePath(this.options);
  }

  abstract print(): string[];

  abstract getError(): IOutputError;
}
