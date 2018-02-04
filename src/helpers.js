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
} from './validation-errors';
import { debug } from './debug';

const JSON_POINTERS_REGEX = /\/[\w_-]+(\/\d+)?/g;

// Make a tree of errors from ajv errors array
export function makeTree(ajvErrors = []) {
  const root = { children: {} };
  ajvErrors.forEach(ajvError => {
    const { dataPath } = ajvError;

    // `dataPath === ''` is root
    const paths = dataPath === '' ? [''] : dataPath.match(JSON_POINTERS_REGEX);
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
   * If there is a `required` error then we can just skip everythig else.
   * And, also `required` should have more priority than `anyOf`. @see #8
   */
  getErrors(root).forEach(error => {
    if (isRequiredError(error)) {
      root.errors = [error];
      root.children = {};
    }
  });

  /**
   * If there is an `anyOf` error that means we have more meaningful errors
   * inside children. So we will just remove all errors from this level.
   */
  // TODO: Need to check children too. There might be no children :(
  if (getErrors(root).some(isAnyOfError)) {
    delete root.errors;
  }

  /**
   * If all errors are `enum` and siblings have any error then we can safely
   * ignore the node.
   *
   * **CAUTION**
   * Need explicit `root.errors` check because `[].every(fn) === true`
   * https://en.wikipedia.org/wiki/Vacuous_truth#Vacuous_truths_in_mathematics
   */
  if (root.errors && getErrors(root).every(isEnumError)) {
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
    const allowedValues = concatAll([])(
      errors.map(e => e.params.allowedValues)
    );
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
    )(
      getChildren(root).map(child => {
        return createErrorInstances(child, options);
      })
    );
  }
}

export default (ajvErrors, options) => {
  const tree = makeTree(ajvErrors || []);
  filterRedundantErrors(tree);
  const errors = createErrorInstances(tree, options);
  if (!errors) {
    debug(JSON.stringify(tree));
  }
  return errors;
};
