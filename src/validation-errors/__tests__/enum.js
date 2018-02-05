import parse from 'json-to-ast';
import { getSchemaAndData } from '../../test-helpers';
import EnumValidationError from '../enum';

describe('Enum', () => {
  let schema, data, jsonRaw, jsonAst;
  beforeAll(async () => {
    [schema, data] = await getSchemaAndData('enum', __dirname);
    jsonRaw = JSON.stringify(data, null, 2);
    jsonAst = parse(jsonRaw, { loc: true });
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
      { data, schema, jsonRaw, jsonAst }
    );

    expect(error.print()).toMatchSnapshot();
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
        params: { allowedValues: ['foo', 'bar'] },
        message: `should be equal to one of the allowed values`,
      },
      { data, schema, jsonRaw, jsonAst }
    );

    expect(error.print(schema, { id: '' })).toMatchSnapshot();
  });
});
