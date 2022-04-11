import Ajv from 'ajv';
import betterAjvErrors from '../';
import { getErrors } from '../utils.js';

describe('utils', () => {
  it('getErrors remaps ajv-errors custom messages', async () => {
    const node = {
      children: {},
      errors: [
        {
          keyword: 'errorMessage',
          dataPath: '/nested',
          schemaPath: '#/errorMessage',
          params: {
            errors: [
              {
                keyword: 'additionalProperties',
                dataPath: '/api/AbortController',
                schemaPath: '#/additionalProperties',
                params: { additionalProperty: 'AbortController$@*)$' },
                message: 'should NOT have additional properties',
              },
            ],
          },
          message: 'Hello world!',
        },
      ],
    };

    const errors = getErrors(node);
    expect(errors).toStrictEqual([
      {
        keyword: 'additionalProperties',
        dataPath: '/api/AbortController',
        schemaPath: '#/additionalProperties',
        params: { additionalProperty: 'AbortController$@*)$' },
        message: 'Hello world!',
      },
    ]);
  });
});
