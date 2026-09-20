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

	describe('when enum includes null (issue #224)', () => {
			let schema, data, jsonRaw, jsonAst;
			beforeAll(async () => {
				[schema, data] = await getSchemaAndData('enum-with-nulls', __dirname);
				jsonRaw = JSON.stringify(data, null, 2);
				jsonAst = parse(jsonRaw);
			});

			it('getError renders null in the error message instead of an empty value', () => {
				const error = new EnumValidationError(
					{
						keyword: 'enum',
						dataPath: '/id',
						schemaPath: '#/enum',
						params: {
							allowedValues: ['foo', 'bar', null],
						},
						message: 'should be equal to one of the allowed values',
					},
					{ data, schema, jsonRaw, jsonAst }
				);

				expect(error.getError().error).toContain('foo, bar, null');
			});

			it('getError does not crash when null is the only allowed value', () => {
				const error = new EnumValidationError(
					{
						keyword: 'enum',
						dataPath: '/id',
						schemaPath: '#/enum',
						params: {
							allowedValues: [null],
						},
						message: 'should be equal to one of the allowed values',
					},
					{ data, schema, jsonRaw, jsonAst }
				);

				expect(() => error.getError()).not.toThrow();
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
});
