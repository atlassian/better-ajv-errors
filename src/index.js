import parse from 'json-to-ast';
import prettify from './helpers';

export default (schema, data, errors, options = {}) => {
  const { colorize = true, format = 'cli', indent = null, json = null } = options;

  const jsonRaw = json || JSON.stringify(data, null, indent);
  const jsonAst = parse(jsonRaw, { loc: true });

  const customErrorToText = error => error.print().join('\n');
  const customErrorToStructure = error => error.getError();
  const customErrors = prettify(errors, {
    colorize,
    data,
    schema,
    jsonAst,
    jsonRaw,
  });

  if (format === 'cli') {
    return customErrors.map(customErrorToText).join('\n\n');
  }

  return customErrors.map(customErrorToStructure);
};
