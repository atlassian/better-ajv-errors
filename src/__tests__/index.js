import { readFileSync } from 'fs';
import Ajv from 'ajv';
import { getFixturePath } from 'jest-fixtures';
import betterAjvErrors from '../';

let schema;
let rawData;
let data;

beforeEach(async () => {
  const schemaPath = await getFixturePath(__dirname, 'default', 'schema.json');
  const dataPath = await getFixturePath(__dirname, 'default', 'data.json');
  schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  rawData = readFileSync(dataPath, 'utf8');
  data = JSON.parse(rawData);
});

describe('Main', () => {
  it('should output error with reconstructed codeframe', async () => {
    const ajv = new Ajv({ jsonPointers: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'cli',
      indent: 2,
    });
    expect(res).toMatchSnapshot();
  });

  it('should output error with codeframe', async () => {
    const ajv = new Ajv({ jsonPointers: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'cli',
      json: rawData,
    });
    expect(res).toMatchSnapshot();
  });
});
