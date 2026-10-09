import Ajv from 'ajv';
import { describe, it, expect } from 'vitest';
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
    const [schema, data, json] = await getSchemaAndData(
      'multiple-required',
      __dirname
    );
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

  it('should output errors for Unicode property paths', async () => {
    const schema = {
      type: 'object',
      properties: { 名前: { type: 'string', minLength: 2 } },
    };
    const data = { 名前: '' };
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'js',
    });

    expect(validate.errors).toEqual([
      expect.objectContaining({ instancePath: '/名前' }),
    ]);
    expect(res).toEqual([
      expect.objectContaining({
        error: '/名前: minLength must NOT have fewer than 2 characters',
      }),
    ]);
  });
});
