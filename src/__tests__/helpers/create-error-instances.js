import { describe, it, expect } from 'vitest';
import { createErrorInstances } from '../../helpers';

describe('createErrorInstances', () => {
  it('should not show duplicate values under allowed values', () => {
    const errors = createErrorInstances(
      {
        children: {},
        errors: [
          {
            keyword: 'enum',
            params: {
              allowedValues: ['one', 'two', 'one'],
            },
          },
          {
            keyword: 'enum',
            params: {
              allowedValues: ['two', 'three', 'four'],
            },
          },
        ],
      },
      {}
    );

    expect(errors).toMatchInlineSnapshot(`
      [
        EnumValidationError {
          "data": undefined,
          "jsonAst": undefined,
          "jsonRaw": undefined,
          "options": {
            "keyword": "enum",
            "params": {
              "allowedValues": [
                "one",
                "two",
                "three",
                "four",
              ],
            },
          },
          "schema": undefined,
        },
      ]
    `);
  });
});
