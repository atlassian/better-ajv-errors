// iTerm2 Theme: https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/deep.itermcolors
import Ajv from 'ajv';

import schema from './src/__fixtures__/default/schema.json' with { type: 'json' };
import data from './src/__fixtures__/default/data.json' with { type: 'json' };

import betterAjvErrors from 'better-ajv-errors';

// options can be passed, e.g. {allErrors: true}
// const ajv = new Ajv({ allErrors: true, async: 'es7' });
const ajv = new Ajv();

const validate = ajv.compile(schema);
const valid = validate(data);

const output = betterAjvErrors(schema, data, validate.errors, {
  indent: 2,
  // format: 'js',
});

if (!valid) {
  console.log(output);
}
