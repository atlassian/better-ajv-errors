import parse from 'json-to-ast';
import prettify from './helpers';
import { log } from './debug';

export default (options = { schema, mode, indent }) => {
  const { schema, mode = 'print', indent = 2 } = options;

  return (data, errors) => {
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

    if (mode === 'print') {
      log(customErrors.map(customErrorToText).join());
    } else {
      return customErrors.map(customErrorToStructure);
    }
  };
};
