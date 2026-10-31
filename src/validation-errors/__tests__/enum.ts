import { parse, type DocumentNode } from '@humanwhocodes/momoa';
import { describe, it, expect, beforeAll } from 'vite-plus/test';
import { getSchemaAndData } from '../../test-helpers';
import EnumValidationError from '../enum';

describe('Enum', () => {
  describe.each<[title: string, name: string, additionalAllowedValues: unknown[]]>([
    ['does not include', 'enum', []],
    ['includes', 'enum-with-nulls', [null]],
  ])('when enum $0 null', (_title, name, additionalAllowedValues) => {
    describe('when value is an object', () => {
      let schema: unknown, data: unknown, jsonRaw: string, jsonAst: DocumentNode;
      beforeAll(async () => {
        [schema, data] = await getSchemaAndData(name, __dirname);
        jsonRaw = JSON.stringify(data, null, 2);
        jsonAst = parse(jsonRaw);
      });

      it('prints correctly for enum prop', () => {
        const error = new EnumValidationError(
          {
            keyword: 'enum',
            dataPath: '/id',
            schemaPath: '#/enum',
            params: {
              allowedValues: ['foo', 'bar', ...additionalAllowedValues],
            },
            message: `should be equal to one of the allowed values`,
          },
          { data, schema, jsonRaw, jsonAst }
        );

        expect(error.print()).toMatchSnapshot();
      });

      it('prints correctly for no levenshtein match', () => {
        const allowedValues = ['one', 'two', ...additionalAllowedValues];
        const error = new EnumValidationError(
          {
            keyword: 'enum',
            dataPath: '/id',
            schemaPath: '#/enum',
            params: {
              allowedValues,
            },
            message: `should be equal to one of the allowed values`,
          },
          { data, schema, jsonRaw, jsonAst }
        );

        expect(error.print()).toMatchSnapshot();
      });

      it('prints correctly for empty value', () => {
        const error = new EnumValidationError(
          {
            keyword: 'enum',
            dataPath: '/id',
            schemaPath: '#/enum',
            params: {
              allowedValues: ['foo', 'bar', ...additionalAllowedValues],
            },
            message: `should be equal to one of the allowed values`,
          },
          { data, schema, jsonRaw, jsonAst }
        );

        expect(error.print()).toMatchSnapshot();
      });
    });
  });

  describe.each<[title: string, name: string, additionalAllowedValues: unknown[]]>([
    ['does not include', 'enum-string', []],
    ['includes', 'enum-string-with-nulls', [null]],
  ])('when enum $0 null', (_title, name, additionalAllowedValues) => {
    describe('when value is a primitive', () => {
      let schema: unknown, data: unknown, jsonRaw: string, jsonAst: DocumentNode;
      beforeAll(async () => {
        [schema, data] = await getSchemaAndData(name, __dirname);
        jsonRaw = JSON.stringify(data, null, 2);
        jsonAst = parse(jsonRaw);
      });

      it('prints correctly for enum prop', () => {
        const error = new EnumValidationError(
          {
            keyword: 'enum',
            dataPath: '',
            schemaPath: '#/enum',
            params: {
              allowedValues: ['foo', 'bar', ...additionalAllowedValues],
            },
            message: 'should be equal to one of the allowed values',
          },
          { data, schema, jsonRaw, jsonAst }
        );

        expect(error.print()).toMatchSnapshot();
      });

      it('prints correctly for no levenshtein match', () => {
        const error = new EnumValidationError(
          {
            keyword: 'enum',
            dataPath: '',
            schemaPath: '#/enum',
            params: {
              allowedValues: ['one', 'two', ...additionalAllowedValues],
            },
            message: 'should be equal to one of the allowed values',
          },
          { data, schema, jsonRaw, jsonAst }
        );

        expect(error.print()).toMatchSnapshot();
      });

      it('prints correctly for empty value', () => {
        const error = new EnumValidationError(
          {
            keyword: 'enum',
            dataPath: '',
            schemaPath: '#/enum',
            params: {
              allowedValues: ['foo', 'bar', ...additionalAllowedValues],
            },
            message: 'should be equal to one of the allowed values',
          },
          { data, schema, jsonRaw, jsonAst }
        );

        expect(error.print()).toMatchSnapshot();
      });
    });
  });
});
