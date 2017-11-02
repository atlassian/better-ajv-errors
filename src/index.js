import prettify from './helpers';
import { log } from './debug';

export default (schema, data, errors) => {
  prettify(errors).forEach(e => log(e.print(schema, data).join('\n')));
};
