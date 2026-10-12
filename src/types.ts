import type { DocumentNode } from '@humanwhocodes/momoa';

/**
 * The fields of an ajv error that are read here. ajv 6 and older name the instance path
 * `dataPath`.
 */
export interface AjvError<Params = Record<string, unknown>> {
  keyword: string;
  instancePath?: string;
  dataPath?: string;
  schemaPath?: string;
  params: Params;
  message?: string;
}

export type EnumParams = { allowedValues: unknown[] };
export type RequiredParams = { missingProperty: string };
export type AdditionalPropertiesParams = { additionalProperty: string };
// ajv-errors replaces the errors it customizes with one `errorMessage` error.
export type ErrorMessageParams = { errors: AjvError[] };

// The errors at one instance path, and the paths below it by their next segment.
export interface ErrorNode {
  children: Record<string, ErrorNode>;
  errors?: AjvError[];
}

// The document the errors are reported against.
export interface ErrorContext {
  data: unknown;
  schema: unknown;
  jsonAst: DocumentNode;
  jsonRaw: string;
}
