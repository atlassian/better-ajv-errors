import { evaluateSchema, getSchemaAndData } from '../../test-helpers';
import EnumValidationError from '../enum';

describe('Enum', () => {
  describe('when value is an object', () => {
    let schema, data, errors, propPath;
    beforeAll(async () => {
      [schema, data] = await getSchemaAndData('enum', __dirname);
      errors = evaluateSchema(schema, data);
      propPath = [];
    });

    it('prints correctly for enum prop', () => {
      const error = new EnumValidationError(errors[0], {
        data,
        schema,
        propPath,
      });

      expect(error.getError()).toMatchSnapshot();
    });

    it('prints correctly for no levenshtein match', () => {
      const changedSchema = JSON.parse(JSON.stringify(schema));
      changedSchema.properties.id.enum = ['one', 'two'];
      const errors = evaluateSchema(changedSchema, data);

      const error = new EnumValidationError(
        {
          ...errors[0],
          params: { allowedValues: ['one', 'two'] },
        },
        { data, schema: changedSchema, propPath },
      );

      expect(error.getError()).toMatchSnapshot();
    });

    it('prints correctly for empty value', () => {
      data = { id: '' };
      const errors = evaluateSchema(schema, data);
      const error = new EnumValidationError(errors[0], {
        data,
        schema,
        propPath,
      });

      expect(error.getError()).toMatchSnapshot();
    });

    it('prints correctly for allowedValues containing null', () => {
      const changedSchema = JSON.parse(JSON.stringify(schema));
      changedSchema.properties.id.enum = ['one', 'two', null];
      const errors = evaluateSchema(changedSchema, data);

      const error = new EnumValidationError(errors[0], {
        data,
        schema,
        propPath,
      });

      expect(error.getError()).toMatchSnapshot();
    });
  });

  describe('when value is a primitive', () => {
    let schema, data, errors, propPath;
    beforeAll(async () => {
      [schema, data] = await getSchemaAndData('enum-string', __dirname);
      errors = evaluateSchema(schema, data);
      propPath = [];
    });

    it('prints correctly for enum prop', () => {
      const error = new EnumValidationError(errors[0], {
        data,
        schema,
        propPath,
      });

      expect(error.getError()).toMatchSnapshot();
    });

    it('prints correctly for no levenshtein match', () => {
      const changedSchema = JSON.parse(JSON.stringify(schema));
      changedSchema.enum = ['one', 'two'];
      errors = evaluateSchema(changedSchema, data);

      const error = new EnumValidationError(errors[0], {
        data,
        schema: changedSchema,
        propPath,
      });

      expect(error.getError()).toMatchSnapshot();
    });

    it('prints correctly for empty value', () => {
      data = '';
      errors = evaluateSchema(schema, data);
      const error = new EnumValidationError(errors[0], {
        data,
        schema,
        propPath,
      });

      expect(error.getError()).toMatchSnapshot();
    });
  });
});
