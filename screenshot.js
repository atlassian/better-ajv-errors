// Prints the CLI output as an asciicast v2 recording for `npm run screenshot` to pipe into svg-term.
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
  // svg-term reads the size from its flags, but the header needs one.
  console.log(JSON.stringify({ version: 2, width: 80, height: 13 }));
  // A terminal's driver turns each line feed into a carriage return and line feed, and svg-term
  // renders the bytes as they are. The event comes before the frame `--at=1000` renders, and one
  // at 0 would make svg-term add a duplicate frame.
  console.log(JSON.stringify([0.5, 'o', `${output}\n`.replaceAll('\n', '\r\n')]));
}
