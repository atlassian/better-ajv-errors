import { getSchemaAndData } from '../../test-helpers';
import EnumValidationError from '../enum';

describe('Enum', () => {
  describe('when value is an object', () => {
    let schema, data, propPath;
    beforeAll(async () => {
      [schema, data] = await getSchemaAndData('enum', __dirname);
      propPath = [];
    });

    it('prints correctly for enum prop', () => {
      const error = new EnumValidationError(
        {
          keyword: 'enum',
          dataPath: '/id',
          schemaPath: '#/enum',
          params: { allowedValues: ['foo', 'bar'] },
          message: `should be equal to one of the allowed values`,
        },
        { data, schema, propPath },
      );

      expect(error.getError()).toMatchSnapshot();
    });

    it('prints correctly for no levenshtein match', () => {
      const error = new EnumValidationError(
        {
          keyword: 'enum',
          dataPath: '/id',
          schemaPath: '#/enum',
          params: { allowedValues: ['one', 'two'] },
          message: `should be equal to one of the allowed values`,
        },
        { data, schema, propPath },
      );

      expect(error.getError()).toMatchSnapshot();
    });

    it('prints correctly for empty value', () => {
      data = { id: '' };
      const error = new EnumValidationError(
        {
          keyword: 'enum',
          dataPath: '/id',
          schemaPath: '#/enum',
          params: { allowedValues: ['foo', 'bar'] },
          message: `should be equal to one of the allowed values`,
        },
        { data, schema, propPath },
      );

      expect(error.getError()).toMatchSnapshot();
    });
  });

  describe('when value is a primitive', () => {
    let schema, data, propPath;
    beforeAll(async () => {
      [schema, data] = await getSchemaAndData('enum-string', __dirname);
      propPath = [];
    });

    it('prints correctly for enum prop', () => {
      const error = new EnumValidationError(
        {
          keyword: 'enum',
          dataPath: '',
          schemaPath: '#/enum',
          params: {
            allowedValues: ['foo', 'bar'],
          },
          message: 'should be equal to one of the allowed values',
        },
        { data, schema, propPath },
      );

      expect(error.getError()).toMatchSnapshot();
    });

    it('prints correctly for no levenshtein match', () => {
      const error = new EnumValidationError(
        {
          keyword: 'enum',
          dataPath: '',
          schemaPath: '#/enum',
          params: {
            allowedValues: ['one', 'two'],
          },
          message: 'should be equal to one of the allowed values',
        },
        { data, schema, propPath },
      );

      expect(error.getError()).toMatchSnapshot();
    });

    it('prints correctly for empty value', () => {
      data = '';
      const error = new EnumValidationError(
        {
          keyword: 'enum',
          dataPath: '',
          schemaPath: '#/enum',
          params: {
            allowedValues: ['foo', 'bar'],
          },
          message: 'should be equal to one of the allowed values',
        },
        { data, schema, propPath },
      );

      expect(error.getError()).toMatchSnapshot();
    });
  });
});
