import { describe, it, expect, beforeAll } from 'vitest';
const { parse } = require('@humanwhocodes/momoa');
import { getSchemaAndData } from '../../test-helpers';
import EnumValidationError from '../enum';

describe('Enum', () => {
  describe.each([
    ['does not include', 'enum', []],
    ['includes', 'enum-with-nulls', [null]],
  ])('when enum $0 null', (_title, name, additionalAllowedValues) => {
    describe('when value is an object', () => {
      let schema, data, jsonRaw, jsonAst;
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
              allowedValues: ['foo', 'bar'].concat(additionalAllowedValues),
            },
            message: `should be equal to one of the allowed values`,
          },
          { data, schema, jsonRaw, jsonAst }
        );

        expect(error.print()).toMatchSnapshot();
      });

      it('prints correctly for no levenshtein match', () => {
        const allowedValues = ['one', 'two'].concat(additionalAllowedValues);
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
              allowedValues: ['foo', 'bar'].concat(additionalAllowedValues),
            },
            message: `should be equal to one of the allowed values`,
          },
          { data, schema, jsonRaw, jsonAst }
        );

        expect(error.print(schema, { id: '' })).toMatchSnapshot();
      });
    });
  });

  describe.each([
    ['does not include', 'enum-string', []],
    ['includes', 'enum-string-with-nulls', [null]],
  ])('when enum $0 null', (_title, name, additionalAllowedValues) => {
    describe('when value is a primitive', () => {
      let schema, data, jsonRaw, jsonAst;
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
              allowedValues: ['foo', 'bar'].concat(additionalAllowedValues),
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
              allowedValues: ['one', 'two'].concat(additionalAllowedValues),
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
              allowedValues: ['foo', 'bar'].concat(additionalAllowedValues),
            },
            message: 'should be equal to one of the allowed values',
          },
          { data, schema, jsonRaw, jsonAst }
        );

        expect(error.print(schema, '')).toMatchSnapshot();
      });
    });
  });

  describe('regression tests for issue #224', () => {
    // Test inputs that actually crash on main
    const testCases = [
      { name: 'null and number', allowedValues: [null, 1], currentValue: 2 },
      {
        name: 'null and boolean',
        allowedValues: [null, true],
        currentValue: false,
      },
      {
        name: 'null and object',
        allowedValues: [null, { a: 1 }],
        currentValue: {},
      },
    ];

    describe('getFormattedAllowedValues helper handles non-string types', () => {
      testCases.forEach(({ name, allowedValues, currentValue }) => {
        it(`does not throw with ${name}`, () => {
          const jsonRaw = JSON.stringify(currentValue, null, 2);
          const jsonAst = parse(jsonRaw);

          const error = new EnumValidationError(
            {
              keyword: 'enum',
              dataPath: '',
              schemaPath: '#/enum',
              params: {
                allowedValues,
              },
              message: `should be equal to one of the allowed values`,
            },
            {
              data: currentValue,
              schema: { type: 'string' },
              jsonRaw,
              jsonAst,
            }
          );

          expect(() => error.getError()).not.toThrow();
          expect(() => error.print()).not.toThrow();
        });
      });
    });

    describe('getError() returns properly formatted values', () => {
      testCases.forEach(({ name, allowedValues }) => {
        it(`correctly formats ${name} in error message`, () => {
          const jsonRaw = '{}';
          const jsonAst = parse(jsonRaw);

          const error = new EnumValidationError(
            {
              keyword: 'enum',
              dataPath: '',
              schemaPath: '#/enum',
              params: {
                allowedValues,
              },
              message: `should be equal to one of the allowed values`,
            },
            { data: {}, schema: {}, jsonRaw, jsonAst }
          );

          const errorObj = error.getError();

          // Check that null is rendered as 'null' string, not empty
          expect(errorObj.error).toContain('null');

          // Verify no trailing commas from empty strings
          const expectedPattern = allowedValues.map(String).join(', ');
          expect(errorObj.error).toContain(expectedPattern);
        });
      });
    });

    describe('findBestMatch() handles non-string bestMatch values', () => {
      it('returns null when only non-string values are best matches', () => {
        const jsonRaw = '{}';
        const jsonAst = parse(jsonRaw);

        // All values are non-strings, so levenshtein doesn't apply
        const error = new EnumValidationError(
          {
            keyword: 'enum',
            dataPath: '',
            schemaPath: '#/enum',
            params: {
              allowedValues: [null, 1, true],
            },
            message: `should be equal to one of the allowed values`,
          },
          { data: 'some-string', schema: {}, jsonRaw, jsonAst }
        );

        expect(error.findBestMatch()).toBeNull();
      });
    });
  });
});
