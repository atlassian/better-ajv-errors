import Ajv from 'ajv';
import Ajv2020 from 'ajv/dist/2020';
import { getSchemaAndData } from '../test-helpers';
import betterAjvErrors from '..';
import betterAjvErrorsBabelExport from '../../lib';
import { openapi } from '@apidevtools/openapi-schemas';

describe('Main', () => {
  it('should output error with reconstructed codeframe', async () => {
    const [schema, data] = await getSchemaAndData('default', __dirname);
    const ajv = new Ajv();
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
    const ajv = new Ajv();
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
      const ajv = new Ajv();
      const validate = ajv.compile(schema);
      const valid = validate(data);
      expect(valid).toBe(false);

      const res = betterAjvErrorsBabelExport(schema, data, validate.errors);
      expect(res).toMatchSnapshot();
    });
  });

  describe('complex schema examples', () => {
    it('should output an error on an invalid openapi definition', async () => {
      const schema = openapi.v31;
      const [, data] = await getSchemaAndData('openapi', __dirname);

      // Need to load the 2020 dist because it supports draft-7, which we'll need for an 3.1.0
      // OpenAPI definition.
      const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: false });

      const validate = ajv.compile(schema);
      const valid = validate(data);
      expect(valid).toBe(false);

      const res = betterAjvErrors(schema, data, validate.errors, {
        indent: 2,
        format: 'cli',
      });
      expect(res).toMatchSnapshot();
    });
  });
});
