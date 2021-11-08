// iTerm2 Theme: https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/deep.itermcolors
const Ajv = require('ajv');

const schema = require('./src/__fixtures__/default/schema.json');
const data = require('./src/__fixtures__/default/data.json');

const betterAjvErrors = require('.').default;

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
  // eslint-disable-next-line no-console
  console.log(output);
}
