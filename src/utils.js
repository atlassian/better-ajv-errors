const eq = x => y => x === y;
const not = fn => x => !fn(x);

const isXError = x => error => error.keyword === x;

export const isAnyOfError = isXError('anyOf');
export const isEnumError = isXError('enum');

export const getChildren = node => (node && Object.values(node.children)) || [];
export const getSiblings = parent => node =>
  getChildren(parent).filter(not(eq(node)));
export const getErrors = node => (node && node.errors) || [];

export const concatAll = xs => ys => ys.reduce((zs, z) => zs.concat(z), xs);
export const notUndefined = x => x !== undefined;
