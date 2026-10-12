import type {
  AdditionalPropertiesParams,
  AjvError,
  ErrorContext,
  ErrorNode,
  RequiredParams,
} from './types';
import {
  getChildren,
  getErrors,
  getInstancePath,
  getSiblings,
  isAnyOfError,
  isEnumError,
  isRequiredError,
  concatAll,
  notUndefined,
} from './utils';
import {
  AdditionalPropValidationError,
  RequiredValidationError,
  EnumValidationError,
  DefaultValidationError,
} from './validation-errors/index';
import type BaseValidationError from './validation-errors/base';

const ARRAY_INDEX_REGEX = /^\d+$/;

// Split a JSON pointer into tree keys. Segments are kept in their escaped form, so a key
// that contains `/` stays one segment. An array index is merged into the segment before it,
// so `/list/0` is one key.
function getTreeKeys(instancePath: string): string[] {
  // AJV before v8 reports JavaScript-style paths such as `['a/ b']` unless `jsonPointers` is set.
  // Those are not JSON pointers, so splitting them on `/` would produce keys that don't exist.
  if (!instancePath.startsWith('/')) {
    return [];
  }
  const segments = instancePath.split('/').slice(1);
  const keys: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    let key = `/${segments[i]}`;
    if (i + 1 < segments.length && ARRAY_INDEX_REGEX.test(segments[i + 1])) {
      key += `/${segments[++i]}`;
    }
    keys.push(key);
  }
  return keys;
}

// Make a tree of errors from ajv errors array
export function makeTree(ajvErrors: AjvError[] = []): ErrorNode {
  const root: ErrorNode = { children: {} };
  ajvErrors.forEach(ajvError => {
    const instancePath = getInstancePath(ajvError);

    // `dataPath === ''` is root
    const paths = instancePath === '' ? [''] : getTreeKeys(instancePath);
    if (paths.length) {
      paths.reduce((obj, path, i) => {
        const child = obj.children[path] || { children: {}, errors: [] };
        obj.children[path] = child;
        if (i === paths.length - 1) {
          child.errors?.push(ajvError);
        }
        return child;
      }, root);
    }
  });
  return root;
}

export function filterRedundantErrors(root: ErrorNode, parent?: ErrorNode, key?: string): void {
  /**
   * Partition out the errors by kind for ease of proceessing
   */
  const { anyOfErrors, enumErrors, requiredErrors } = getErrors(root).reduce<
    Record<'anyOfErrors' | 'enumErrors' | 'requiredErrors', AjvError[]>
  >(
    (acc, error) => {
      if (isRequiredError(error)) {
        acc.requiredErrors.push(error);

        return acc;
      }

      if (isAnyOfError(error)) {
        acc.anyOfErrors.push(error);
      }

      if (isEnumError(error)) {
        acc.enumErrors.push(error);
      }

      return acc;
    },
    { anyOfErrors: [], enumErrors: [], requiredErrors: [] }
  );

  /**
   * If there is are `required` errors then we can just drop every non-required error.
   * And, also `required` should have more priority than `anyOf`. @see #8
   */

  if (requiredErrors.length > 0) {
    root.errors = requiredErrors;
    root.children = {};

    // No need for further processing, as we've emptied out children
    return;
  }

  /**
   * If there is an `anyOf` error that means we have more meaningful errors
   * inside children. So we will just remove all errors from this level.
   *
   * If there are no children, then we don't delete the errors since we should
   * have at least one error to report.
   */
  if (anyOfErrors.length > 0 && Object.keys(root.children).length > 0) {
    delete root.errors;
  }

  /**
   * If all errors are `enum` and siblings have any error then we can safely
   * ignore the node. As we return early if there's required errors, we only
   * need to check anyofErrors length
   *
   * The root has no parent, and so no siblings.
   *
   * **CAUTION**
   * Need explicit `root.errors` check because `[].every(fn) === true`
   * https://en.wikipedia.org/wiki/Vacuous_truth#Vacuous_truths_in_mathematics
   */
  if (enumErrors.length > 0 && anyOfErrors.length === 0 && parent && key !== undefined) {
    if (
      getSiblings(parent)(root)
        // Remove any reference which becomes `undefined` later
        .filter(notUndefined)
        .some(getErrors)
    ) {
      delete parent.children[key];
    }
  }

  Object.entries(root.children).forEach(([key, child]) => filterRedundantErrors(child, root, key));
}

export function createErrorInstances(
  root: ErrorNode,
  options: ErrorContext
): BaseValidationError[] {
  const errors = getErrors(root);
  if (errors.length && errors.every(isEnumError)) {
    const uniqueValues = new Set(concatAll<unknown>([])(errors.map(e => e.params.allowedValues)));
    const allowedValues = [...uniqueValues];
    const error = errors[0];
    return [
      new EnumValidationError(
        {
          ...error,
          params: { allowedValues },
        },
        options
      ),
    ];
  } else {
    return concatAll(
      errors.reduce<BaseValidationError[]>((ret, error) => {
        // The keyword determines the params.
        switch (error.keyword) {
          case 'additionalProperties':
            return ret.concat(
              new AdditionalPropValidationError(
                error as AjvError<AdditionalPropertiesParams>,
                options
              )
            );
          case 'required':
            return ret.concat(
              new RequiredValidationError(error as AjvError<RequiredParams>, options)
            );
          default:
            return ret.concat(new DefaultValidationError(error, options));
        }
      }, [])
    )(getChildren(root).map(child => createErrorInstances(child, options)));
  }
}

export default (
  ajvErrors: AjvError[] | null | undefined,
  options: ErrorContext
): BaseValidationError[] => {
  const tree = makeTree(ajvErrors || []);
  filterRedundantErrors(tree);
  return createErrorInstances(tree, options);
};
