import Ajv from 'ajv';
import betterAjvErrors from '../../';
import { getSchemaAndData } from '../../test-helpers';

describe('Main', () => {
  it('should support js output format for default errors', async () => {
    const [schema, data] = await getSchemaAndData('default', __dirname);

    const ajv = new Ajv({ jsonPointers: true });
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

    const ajv = new Ajv({ jsonPointers: true });
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

    const ajv = new Ajv({ jsonPointers: true });
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

    const ajv = new Ajv({ jsonPointers: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'js',
    });
    expect(res).toMatchSnapshot();
  });
});
