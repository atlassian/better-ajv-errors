import parse from 'json-to-ast';
import { getSchemaAndData } from '../../test-helpers';
import RequiredValidationError from '../required';

describe('Required', () => {
  it.each([
    ['prints correctly for missing required prop', true],
    ['prints correctly for missing required prop[without colors]', false],
  ])('%s', async (_, colorize) => {
    const [schema, data] = await getSchemaAndData('required', __dirname);
    const jsonRaw = JSON.stringify(data, null, 2);
    const jsonAst = parse(jsonRaw, { loc: true });

    const error = new RequiredValidationError(
      {
        keyword: 'required',
        dataPath: '/nested',
        schemaPath: '#/required',
        params: { missingProperty: 'id' },
        message: `should have required property 'id'`,
      },
      { colorize, data, schema, jsonRaw, jsonAst }
    );

    expect(error.print()).toMatchSnapshot();
  });
});
