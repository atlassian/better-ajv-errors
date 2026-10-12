import type { ErrorObject } from 'ajv';
import { parse } from '@humanwhocodes/momoa';
import prettify from './helpers';
import type BaseValidationError from './validation-errors/base';

export interface IOutputError {
  start: { line: number; column: number; offset: number };
  // Optional for required
  end?: { line: number; column: number; offset: number };
  error: string;
  path: string;
  suggestion?: string;
}

export interface IInputOptions {
  format?: 'cli' | 'js';
  indent?: number | null;

  /** Raw JSON used when highlighting error location */
  json?: string | null;
}

export default function betterAjvErrors<S, T, Options extends IInputOptions>(
  schema: S,
  data: T,
  errors: Array<ErrorObject> | null | undefined,
  options?: Options
): Options extends { format: 'js' } ? Array<IOutputError> : string {
  const { format = 'cli', indent = null, json = null }: IInputOptions = options ?? {};

  const jsonRaw = json || JSON.stringify(data, null, indent ?? undefined);
  const jsonAst = parse(jsonRaw);

  const customErrorToText = (error: BaseValidationError) => error.print().join('\n');
  const customErrorToStructure = (error: BaseValidationError) => error.getError();
  const customErrors = prettify(errors, {
    data,
    schema,
    jsonAst,
    jsonRaw,
  });

  const output =
    format === 'cli'
      ? customErrors.map(customErrorToText).join('\n\n')
      : customErrors.map(customErrorToStructure);
  return output as Options extends { format: 'js' } ? Array<IOutputError> : string;
}
