import prettify from './helpers';
import { log } from './debug';

export default (options = { schema, mode = 'print', indent = 2 }) => {
  return (data, errors) => {
    prettify(errors, options.indent).forEach(customError => {
      const text = customError.print(schema, data).join('\n');

      if (options.mode === 'print') {
        log(text);
      }
    });
  };
};
