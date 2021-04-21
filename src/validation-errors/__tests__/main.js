import betterAjvErrors from '../../';
import { evaluateSchema, getSchemaAndData } from '../../test-helpers';

describe('Main', () => {
  it('should support js output format for default errors', async () => {
    const [schema, data] = await getSchemaAndData('default', __dirname);
    const errors = evaluateSchema(schema, data);

    const res = betterAjvErrors(schema, errors, {
      propertyPath: [],
      targetValue: data,
    });
    expect(res).toMatchSnapshot();
  });

  it('should support js output format for required errors', async () => {
    const [schema, data] = await getSchemaAndData('required', __dirname);
    const errors = evaluateSchema(schema, data);

    const res = betterAjvErrors(schema, errors, {
      propertyPath: [],
      targetValue: data,
    });
    expect(res).toMatchSnapshot();
  });

  it('should support js output format for additionalProperties errors', async () => {
    const [schema, data] = await getSchemaAndData(
      'additionalProperties',
      __dirname,
    );
    const errors = evaluateSchema(schema, data);

    const res = betterAjvErrors(schema, errors, {
      propertyPath: [],
      targetValue: data,
    });
    expect(res).toMatchSnapshot();
  });

  it('should support js output format for enum errors', async () => {
    const [schema, data] = await getSchemaAndData('enum', __dirname);
    const errors = evaluateSchema(schema, data);

    const res = betterAjvErrors(schema, errors, {
      propertyPath: [],
      targetValue: data,
    });
    expect(res).toMatchSnapshot();
  });
});
