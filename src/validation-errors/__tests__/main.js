import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import Ajv2020 from 'ajv/dist/2020';
import betterAjvErrors from '../../';
import { getSchemaAndData } from '../../test-helpers';

describe('Main', () => {
  it('should support js output format for default errors', async () => {
    const [schema, data] = await getSchemaAndData('default', __dirname);

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'js',
    });
    expect(res).toMatchSnapshot();
  });

  it('should support js output format for required errors', async () => {
    const [schema, data] = await getSchemaAndData('required', __dirname);

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'js',
    });
    expect(res).toMatchSnapshot();
  });

  it('should support js output format for additionalProperties errors', async () => {
    const [schema, data] = await getSchemaAndData(
      'additionalProperties',
      __dirname
    );

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'js',
    });
    expect(res).toMatchSnapshot();
  });

  it('should support js output format for unevaluatedProperties errors', async () => {
    const [schema, data] = await getSchemaAndData(
      'unevaluatedProperties',
      __dirname
    );

    const ajv = new Ajv2020();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'js',
    });
    expect(res).toMatchSnapshot();
  });

  it('should support js output format for enum errors', async () => {
    const [schema, data] = await getSchemaAndData('enum', __dirname);

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'js',
    });
    expect(res).toMatchSnapshot();
  });
});
