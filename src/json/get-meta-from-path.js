import parse, { getMeta, getValue } from './parse';

export default function getMetaFromPath(jsonString, dataPath) {
  // TODO: Handle json pointer escape notation and better error handling
  return getMeta(
    dataPath
      .split('/')
      .slice(1)
      .reduce((obj, pointer) => getValue(obj, pointer), parse(jsonString))
  );
}
