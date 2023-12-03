// @flow

// Basic
const eq = x => y => x === y;
const not = fn => x => !fn(x);

const getValues = o => Object.values(o);

export const notUndefined = x => x !== undefined;

// Error
const isXError = x => error => error.keyword === x;
export const isRequiredError = isXError('required');
export const isAnyOfError = isXError('anyOf');
export const isEnumError = isXError('enum');
export const getErrors = node =>
  node && node.errors
    ? node.errors.map(e =>
        e.keyword === 'errorMessage'
          ? { ...e.params.errors[0], message: e.message }
          : e
      )
    : [];

// Node
export const getChildren = node => (node && getValues(node.children)) || [];

export const getSiblings = parent => node =>
  getChildren(parent).filter(not(eq(node)));

export const concatAll = xs => ys => ys.reduce((zs, z) => zs.concat(z), xs);
