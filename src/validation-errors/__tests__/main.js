import Ajv from 'ajv';
import betterAjvErrors from '../../';
import { getSchemaAndData } from '../../test-helpers';

describe('Main', () => {
  it('should support return option for default errors', async () => {
    const [schema, data] = await getSchemaAndData('default', __dirname);
    const print = betterAjvErrors({ schema, mode: 'return' });

    const ajv = new Ajv({ jsonPointers: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = print(data, validate.errors);
    expect(res).toMatchSnapshot();
  });

  it('should support return option for required errors', async () => {
    const [schema, data] = await getSchemaAndData('required', __dirname);
    const print = betterAjvErrors({ schema, mode: 'return' });

    const ajv = new Ajv({ jsonPointers: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = print(data, validate.errors);
    expect(res).toMatchSnapshot();
  });

  it('should support return option for additionalProperties errors', async () => {
    const [schema, data] = await getSchemaAndData(
      'additionalProperties',
      __dirname
    );
    const print = betterAjvErrors({ schema, mode: 'return' });

    const ajv = new Ajv({ jsonPointers: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = print(data, validate.errors);
    expect(res).toMatchSnapshot();
  });

  it('should support return option for enum errors', async () => {
    const [schema, data] = await getSchemaAndData('enum', __dirname);
    const print = betterAjvErrors({ schema, mode: 'return' });

    const ajv = new Ajv({ jsonPointers: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = print(data, validate.errors);
    expect(res).toMatchSnapshot();
  });
});
