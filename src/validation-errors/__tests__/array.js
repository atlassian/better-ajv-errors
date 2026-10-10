import Ajv from 'ajv';
import { describe, it, expect, beforeEach } from 'vitest';
const { parse } = require('@humanwhocodes/momoa');

import { getSchemaAndData } from '../../test-helpers';
import { ArrayPropertyValidationError } from '../array';

describe('Array Properties', () => {
	const ajv = new Ajv();
	let validator;

	describe.each([
		['Minimum Items', 'min-items'],
		['Maximum Items', 'max-items'],
		['Unique Items', 'unique'],
	])('$0', (_title, directory) => {
		describe.each([
			['at root', 'root'],
			['inside object', 'in-object'],
		])('for $0', (_title, name) => {
			let schema, data, jsonRaw, jsonAst;

			beforeEach(async () => {
				[schema, data] = await getSchemaAndData(`array/${directory}/${name}`, __dirname);
				jsonRaw = JSON.stringify(data, null, 2);
				jsonAst = parse(jsonRaw);
				validator = ajv.compile(schema)
			});

			it('prints correctly, without confusing leading keyword', async () => {
				const valid = validator(data);
				const error = new ArrayPropertyValidationError(
					validator.errors[0],
					{ data, schema, jsonRaw, jsonAst },
				);

				expect(valid).toBe(false);
				expect(error.print()).toMatchSnapshot();
			});
		});
	});
});

