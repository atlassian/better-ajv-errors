import Ajv from 'ajv';
import { getSchemaAndData } from '../test-helpers';
import betterAjvErrors from '..';
import betterAjvErrorsBabelExport from '../../lib';

describe('Main', () => {
  it('should output error with reconstructed codeframe', async () => {
    const [schema, data] = await getSchemaAndData('default', __dirname);
    const ajv = new Ajv({ jsonPointers: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBe(false);

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'cli',
      indent: 2,
    });
    expect(res).toMatchSnapshot();
  });

  it('should output error with codeframe', async () => {
    const [schema, data, json] = await getSchemaAndData('default', __dirname);
    const ajv = new Ajv({ jsonPointers: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBe(false);

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'cli',
      json,
    });
    expect(res).toMatchSnapshot();
  });

  describe('Babel export', () => {
    it('should function as normal', async () => {
      const [schema, data] = await getSchemaAndData('default', __dirname);
      const ajv = new Ajv({ jsonPointers: true });
      const validate = ajv.compile(schema);
      const valid = validate(data);
      expect(valid).toBe(false);

      const res = betterAjvErrorsBabelExport(schema, data, validate.errors);
      expect(res).toMatchSnapshot();
    });
  });
});
