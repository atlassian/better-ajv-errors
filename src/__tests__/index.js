import Ajv from 'ajv';
import { describe, it, expect } from 'vite-plus/test';
import { getSchemaAndData } from '../test-helpers';
import betterAjvErrors from '../';

describe('Main', () => {
  it('should output error with reconstructed codeframe', async () => {
    const [schema, data] = await getSchemaAndData('default', __dirname);
    const ajv = new Ajv();
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
    const [schema, data, json] = await getSchemaAndData('default', __dirname);
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'cli',
      json,
    });
    expect(res).toMatchSnapshot();
  });

  it('should output errors for multiple required values', async () => {
    const [schema, data, json] = await getSchemaAndData('multiple-required', __dirname);
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'cli',
      json,
    });

    expect(res).toMatchSnapshot();
  });

  it('should point at the last duplicate key when using the json option', () => {
    // JSON.parse keeps the last value of a duplicate key, so that is what ajv validates.
    const json = '{\n  "a": { "b": 1 },\n  "a": { "b": "two" }\n}';
    const data = JSON.parse(json);
    const schema = {
      type: 'object',
      properties: { a: { type: 'object', properties: { b: { type: 'number' } } } },
    };
    const validate = new Ajv().compile(schema);
    expect(validate(data)).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, { format: 'js', json });
    expect(res).toEqual([
      {
        start: { line: 3, column: 15, offset: 35 },
        end: { line: 3, column: 20, offset: 40 },
        error: '/a/b: type must be number',
        path: '/a/b',
      },
    ]);
  });
});
