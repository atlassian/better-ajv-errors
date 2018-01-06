import prettify from './helpers';
import { log } from './debug';

export default (options = { schema, mode, indent }) => {
  const { schema, mode = 'print', indent = 2 } = options;

  return (data, errors) => {
    const customErrorToText = error => error.print(schema, data).join('\n');
    const customErrorToStructure = error => error.getError(schema, data);
    const customErrors = prettify(errors, indent);

    if (mode === 'print') {
      log(customErrors.map(customErrorToText).join());
    } else {
      return customErrors.map(customErrorToStructure);
    }
  };
};
