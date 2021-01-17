// @flow

/*::
import type { Error, Node } from './types';
*/

// Basic
const eq = (x) => (y) => x === y;
const not = (fn) => (x) => !fn(x);

// https://github.com/facebook/flow/issues/2221
const getValues = /*::<Obj: Object>*/ (
  o /*: Obj*/
) /*: $ReadOnlyArray<$Values<Obj>>*/ => Object.values(o);

export const notUndefined = (x /*: mixed*/) => x !== undefined;

// Error
const isXError = (x) => (error /*: Error */) => error.keyword === x;
export const isRequiredError = isXError('required');
export const isAnyOfError = isXError('anyOf');
export const isEnumError = isXError('enum');
export const getErrors = (node /*: Node*/) => (node && node.errors) || [];

// Node
export const getChildren = (node /*: Node*/) /*: $ReadOnlyArray<Node>*/ =>
  (node && getValues(node.children)) || [];

export const getSiblings = (parent /*: Node*/) => (
  node /*: Node*/
) /*: $ReadOnlyArray<Node>*/ => getChildren(parent).filter(not(eq(node)));

export const concatAll = /*::<T>*/ (xs /*: $ReadOnlyArray<T>*/) => (
  ys /*: $ReadOnlyArray<T>*/
) /*: $ReadOnlyArray<T>*/ => ys.reduce((zs, z) => zs.concat(z), xs);
