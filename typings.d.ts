import { ErrorObject } from 'ajv';

declare namespace betterAjvErrors {
  export interface IInputOptions {
    format?: 'cli' | 'js';
    indent?: number | null;

    /** Raw JSON used when highlighting error location */
    json?: string | null;
  }

  export interface IOutputError {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number } | undefined;
    error: string;
    dataPath: string;
    suggestion?: string;
  }
}

declare function betterAjvErrors(
  schema: any,
  data: any,
  errors?: ErrorObject[] | null,
  options?: betterAjvErrors.IInputOptions & { format?: 'cli' }
): string;
declare function betterAjvErrors(
  schema: any,
  data: any,
  errors: ErrorObject[] | null | undefined,
  options: betterAjvErrors.IInputOptions & { format: 'js' }
): betterAjvErrors.IOutputError[];
declare function betterAjvErrors(
  schema: any,
  data: any,
  errors?: ErrorObject[] | null,
  options?: betterAjvErrors.IInputOptions
): string | betterAjvErrors.IOutputError[];

export = betterAjvErrors;
