import { describe, it, expect } from 'vite-plus/test';
import { createErrorInstances } from '../../helpers';
import type { ErrorContext } from '../../types';

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
      {} as ErrorContext
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
