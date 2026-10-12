import type { AjvError, EnumParams, ErrorMessageParams, ErrorNode, RequiredParams } from './types';

// Basic
const eq =
  <T>(x: T) =>
  (y: T): boolean =>
    x === y;
const not =
  <T>(fn: (x: T) => boolean) =>
  (x: T): boolean =>
    !fn(x);

const getValues = <T>(o: Record<string, T>): T[] => Object.values(o);

export const notUndefined = <T>(x: T | undefined): x is T => x !== undefined;

// Error
const isXError =
  <Params extends Record<string, unknown>>(x: string) =>
  (error: AjvError): error is AjvError<Params> =>
    error.keyword === x;
export const isRequiredError: (error: AjvError) => error is AjvError<RequiredParams> =
  isXError('required');
export const isAnyOfError: (error: AjvError) => boolean = isXError('anyOf');
export const isEnumError: (error: AjvError) => error is AjvError<EnumParams> = isXError('enum');
export const getErrors = (node: ErrorNode | undefined): AjvError[] =>
  node && node.errors
    ? node.errors.map(e =>
        e.keyword === 'errorMessage'
          ? { ...(e as AjvError<ErrorMessageParams>).params.errors[0], message: e.message }
          : e
      )
    : [];

// ajv reports either path, so one of them is set.
export const getInstancePath = (error: Pick<AjvError, 'instancePath' | 'dataPath'>): string =>
  (typeof error.instancePath !== 'undefined' ? error.instancePath : error.dataPath) as string;

// Node
export const getChildren = (node: ErrorNode | undefined): ErrorNode[] =>
  (node && getValues(node.children)) || [];

export const getSiblings =
  (parent: ErrorNode | undefined) =>
  (node: ErrorNode): ErrorNode[] =>
    getChildren(parent).filter(not(eq(node)));

export const concatAll =
  <T>(xs: T[]) =>
  (ys: T[][]): T[] =>
    ys.reduce((zs, z) => zs.concat(z), xs);
