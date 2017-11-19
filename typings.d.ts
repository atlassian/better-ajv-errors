import { ErrorObject } from 'ajv';

declare var betterAjvErrors: betterAjvErrors.IBetterAjvErrors;

export = betterAjvErrors;
export as namespace betterAjvErrors;

declare namespace betterAjvErrors {
  export interface IInputOptions {
    schema: any;
    mode?: 'print' | 'return';
    indent?: number;
  }

  export interface IOutputError {
    error: string;
    line: number;
    column: number;
    suggestion?: string;
  }

  export interface IBetterAjvErrors {
    (options: betterAjvErrors.IInputOptions): betterAjvErrors.IPrintErrors;
  }

  export interface IPrintErrors {
    (data: any, errors: ErrorObject[]): betterAjvErrors.IOutputError[] | void;
  }
}
