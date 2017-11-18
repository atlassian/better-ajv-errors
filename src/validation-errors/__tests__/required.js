import { getSchemaAndData } from '../../test-helpers';
import RequiredValidationError from '../required';

describe('Required', () => {
  it('prints correctly for missing required prop', async () => {
    const [schema, data] = await getSchemaAndData('required', __dirname);

    const error = new RequiredValidationError({
      keyword: 'required',
      dataPath: '',
      schemaPath: '#/required',
      params: { missingProperty: 'id' },
      message: `should have required property 'id'`,
    });

    expect(error.print(schema, data)).toMatchSnapshot();
  });
});
