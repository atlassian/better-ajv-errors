import {
  getChildren,
  getErrors,
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

const JSON_POINTERS_REGEX = /\/[\w_-]+(\/\d+)?/g;

// Make a tree of errors from ajv errors array
export function makeTree(ajvErrors = []) {
  const root = { children: {} };
  ajvErrors.forEach(ajvError => {
    const instancePath =
      typeof ajvError.instancePath !== 'undefined'
        ? ajvError.instancePath
        : ajvError.dataPath;

    // `dataPath === ''` is root
    const paths =
      instancePath === '' ? [''] : instancePath.match(JSON_POINTERS_REGEX);
    paths &&
      paths.reduce((obj, path, i) => {
        obj.children[path] = obj.children[path] || { children: {}, errors: [] };
        if (i === paths.length - 1) {
          obj.children[path].errors.push(ajvError);
        }
        return obj.children[path];
      }, root);
  });
  return root;
}

export function filterRedundantErrors(root, parent, key) {
  /**
    * Partition out the errors by kind for ease of proceessing
    */
  const { anyOfErrors, enumErrors, requiredErrors } = getErrors(root).reduce(
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
    { anyOfErrors: [], enumErrors: [], requiredErrors: [] },
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
   * **CAUTION**
   * Need explicit `root.errors` check because `[].every(fn) === true`
   * https://en.wikipedia.org/wiki/Vacuous_truth#Vacuous_truths_in_mathematics
   */
  if (enumErrors.length > 0 && anyOfErrors.length === 0) {
    if (
      getSiblings(parent)(root)
        // Remove any reference which becomes `undefined` later
        .filter(notUndefined)
        .some(getErrors)
    ) {
      delete parent.children[key];
    }
  }

  Object.entries(root.children).forEach(([key, child]) =>
    filterRedundantErrors(child, root, key)
  );
}

export function createErrorInstances(root, options) {
  const errors = getErrors(root);
  if (errors.length && errors.every(isEnumError)) {
    const uniqueValues = new Set(
      concatAll([])(errors.map(e => e.params.allowedValues))
    );
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
      errors.reduce((ret, error) => {
        switch (error.keyword) {
          case 'additionalProperties':
            return ret.concat(
              new AdditionalPropValidationError(error, options)
            );
          case 'required':
            return ret.concat(new RequiredValidationError(error, options));
          default:
            return ret.concat(new DefaultValidationError(error, options));
        }
      }, [])
    )(getChildren(root).map(child => createErrorInstances(child, options)));
  }
}

export default (ajvErrors, options) => {
  const tree = makeTree(ajvErrors || []);
  filterRedundantErrors(tree);
  return createErrorInstances(tree, options);
};
