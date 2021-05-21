import parse from 'json-to-ast';
import { getSchemaAndData } from '../../test-helpers';
import AdditionalPropValidationError from '../additional-prop';

describe('Additional properties', () => {
  let schema, data, jsonRaw, jsonAst;
  beforeAll(async () => {
    [schema, data] = await getSchemaAndData('additional-prop', __dirname);
    jsonRaw = JSON.stringify(data, null, 2);
    jsonAst = parse(jsonRaw, { loc: true });
  });

  it('prints correctly', () => {
    const error = new AdditionalPropValidationError(
      {
        keyword: 'additionalProperties',
        dataPath: '',
        schemaPath: '#/additionalProperties',
        params: { additionalProperty: 'bar' },
        message: 'should NOT have additional properties',
      },
      { data, schema, jsonRaw, jsonAst }
    );

    expect(error.print()).toMatchSnapshot();
  });
});
