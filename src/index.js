import prettify from './helpers';
import { log } from './debug';

export default (options = { schema, mode, indent }) => {
  const {
    schema,
    mode = 'print',
    indent = 2,
  } = options;

  return (data, errors) => {
    const customErrorToText = (error) => error.print(schema, data).join('\n');
    const customErrors = prettify(errors, indent).map(customErrorToText);

    if (mode === 'print') {
      log(customErrors.join());
    } else {
      return customErrors;
    }
  };
};
