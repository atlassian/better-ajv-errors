import parse from 'json-to-ast';
import prettify from './helpers';

export default (schema, data, errors, options = {}) => {
  const { format = 'cli', indent = null } = options;

  const jsonRaw = JSON.stringify(data, null, indent);
  const jsonAst = parse(jsonRaw, { loc: true });

  const customErrorToText = error => error.print().join('\n');
  const customErrorToStructure = error => error.getError();
  const customErrors = prettify(errors, {
    data,
    schema,
    jsonAst,
    jsonRaw,
  });

  if (format === 'cli') {
    return customErrors.map(customErrorToText).join();
  } else {
    return customErrors.map(customErrorToStructure);
  }
};
