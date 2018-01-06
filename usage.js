const Ajv = require('ajv');

const schema = require('./src/__fixtures__/schema.json');
const data = require('./src/__fixtures__/data.json');

const betterAjvErrors = require('./src');

// options can be passed, e.g. {allErrors: true}
// const ajv = new Ajv({ allErrors: true, async: 'es7', jsonPointers: true });
const ajv = new Ajv({ jsonPointers: true });

const validate = ajv.compile(schema);
const valid = validate(data);

const print = betterAjvErrors({ schema, mode: 'print', indent: 2 });

if (!valid) {
  print(data, validate.errors);
}
