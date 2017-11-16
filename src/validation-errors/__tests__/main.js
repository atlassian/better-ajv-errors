import Ajv from 'ajv';
import betterAjvErrors from '../../';
import { getSchemaAndData } from '../../test-helpers';

describe('Main', () => {
  it('should expose currying function', () => {
    expect(typeof betterAjvErrors).toBe('function');

    const print = betterAjvErrors({ schema: {} });
    expect(typeof print).toBe('function');
  });

  it('should print errors by default', async () => {
    const [schema, data] = await getSchemaAndData('main', __dirname);
    const print = betterAjvErrors({ schema });

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    const res = print(data, validate.errors);

    expect(res).toBeUndefined();
  });

  it('should support "return" mode', async () => {
    const [schema, data] = await getSchemaAndData('main', __dirname);
    const print = betterAjvErrors({ schema, mode: 'return' });

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    const res = print(data, validate.errors);

    expect(res).toHaveLength(1);
  });

  it('should support "indent" option', async () => {
    const [schema, data] = await getSchemaAndData('main', __dirname);
    const print = betterAjvErrors({ schema, mode: 'return', indent: 1 });

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    const res = print(data, validate.errors);

    expect(res).toMatchSnapshot();
  });
});
