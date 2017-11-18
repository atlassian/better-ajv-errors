import prettify from './helpers';
import { log } from './debug';

export default (options = { schema, mode, indent }) => {
  const customErrorToText = (error, data) =>
    error.print(schema, data).join('\n');
  const customErrorToStructure = (error, data) => error.getError(schema, data);

  const { schema, mode = 'print', indent = 2 } = options;

  return (data, errors) => {
    const customErrors = prettify(errors, indent);

    if (mode === 'print') {
      log(customErrors.map(error => customErrorToText(error, data)).join());
    } else {
      return customErrors.map(error => customErrorToStructure(error, data));
    }
  };
};
