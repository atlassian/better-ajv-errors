import Ajv from 'ajv';
import betterAjvErrors from '../';
import { getSchemaAndData } from '../test-helpers';

describe('Main', () => {
  it('should output proper error for enumeration', async () => {
    const [schema, data] = await getSchemaAndData('enum', __dirname);
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

  it('should output proper error for enumeration in anyOf', async () => {
    const [schema, data] = await getSchemaAndData('enum-anyof', __dirname);
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
});
