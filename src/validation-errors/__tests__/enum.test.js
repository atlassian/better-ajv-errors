import parse from 'json-to-ast';
import { getSchemaAndData } from '../../test-helpers';
import EnumValidationError from '../enum';

describe('Enum', () => {
  describe('when value is an object', () => {
    let schema;
    let data;
    let jsonRaw;
    let jsonAst;

    beforeAll(async () => {
      [schema, data] = await getSchemaAndData('enum', __dirname);
      jsonRaw = JSON.stringify(data, null, 2);
      jsonAst = parse(jsonRaw, { loc: true });
    });

    it.each([
      ['prints correctly for enum prop', true],
      ['prints correctly for enum prop [without colors]', false],
    ])('%s', (_, colorize) => {
      const error = new EnumValidationError(
        {
          keyword: 'enum',
          dataPath: '/id',
          schemaPath: '#/enum',
          params: { allowedValues: ['foo', 'bar'] },
          message: `should be equal to one of the allowed values`,
        },
        { colorize, data, schema, jsonRaw, jsonAst }
      );

      expect(error.print()).toMatchSnapshot();
    });

    it.each([
      ['prints correctly for no levenshtein match', true],
      ['prints correctly for no levenshtein match [without colors]', false],
    ])('%s', (_, colorize) => {
      const error = new EnumValidationError(
        {
          keyword: 'enum',
          dataPath: '/id',
          schemaPath: '#/enum',
          params: { allowedValues: ['one', 'two'] },
          message: `should be equal to one of the allowed values`,
        },
        { colorize, data, schema, jsonRaw, jsonAst }
      );

      expect(error.print()).toMatchSnapshot();
    });

    it.each([
      ['prints correctly for empty value', true],
      ['prints correctly for empty value [without colors]', false],
    ])('%s', (_, colorize) => {
      const error = new EnumValidationError(
        {
          keyword: 'enum',
          dataPath: '/id',
          schemaPath: '#/enum',
          params: { allowedValues: ['foo', 'bar'] },
          message: `should be equal to one of the allowed values`,
        },
        { colorize, data, schema, jsonRaw, jsonAst }
      );

      expect(error.print(schema, { id: '' })).toMatchSnapshot();
    });
  });

  describe('when value is a primitive', () => {
    let schema;
    let data;
    let jsonRaw;
    let jsonAst;

    beforeAll(async () => {
      [schema, data] = await getSchemaAndData('enum-string', __dirname);
      jsonRaw = JSON.stringify(data, null, 2);
      jsonAst = parse(jsonRaw, { loc: true });
    });

    it.each([
      ['prints correctly for enum prop', true],
      ['prints correctly for enum prop [without colors]', false],
    ])('%s', (_, colorize) => {
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
        { colorize, data, schema, jsonRaw, jsonAst }
      );

      expect(error.print()).toMatchSnapshot();
    });

    it.each([
      ['prints correctly for no levenshtein match', true],
      ['prints correctly for no levenshtein match [without colors]', false],
    ])('%s', (_, colorize) => {
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
        { colorize, data, schema, jsonRaw, jsonAst }
      );

      expect(error.print()).toMatchSnapshot();
    });

    it.each([
      ['prints correctly for empty value', true],
      ['prints correctly for empty value [without colors]', false],
    ])('%s', (_, colorize) => {
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
        { colorize, data, schema, jsonRaw, jsonAst }
      );

      expect(error.print(schema, '')).toMatchSnapshot();
    });
  });
});
