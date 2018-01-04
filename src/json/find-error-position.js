import parse, { META_SYMBOL, VALUE_SYMBOL } from './parse';

export default function findErrorPosition(jsonString, dataPath) {
  // console.log(JSON.stringify(parse(jsonString), null, 2));
  // TODO: Handle json pointer escape notation and better error handling
  const { [META_SYMBOL]: { line, column } } = dataPath
    .split('/')
    .slice(1)
    .reduce(
      (obj, pointer) => obj[VALUE_SYMBOL][pointer] || obj[VALUE_SYMBOL][VALUE_SYMBOL][pointer],
      parse(jsonString)
    );

  return { line, column };
}
