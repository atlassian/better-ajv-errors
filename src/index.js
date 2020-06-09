import parse from 'json-to-ast';
import prettify from './helpers';

export default (schema, data, errors, options = {}) => {
  const { indent = null } = options;

  const jsonRaw = JSON.stringify(data, null, indent);
  const jsonAst = parse(jsonRaw, { loc: true });

  const customErrorToStructure = error => error.getError();
  const customErrors = prettify(errors, {
    data,
    schema,
    jsonAst,
    jsonRaw,
  });
  return customErrors.map(customErrorToStructure);
};
