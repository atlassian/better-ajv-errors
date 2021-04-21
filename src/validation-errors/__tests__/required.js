import { evaluateSchema, getSchemaAndData } from '../../test-helpers';
import RequiredValidationError from '../required';

describe('Required', () => {
  it('prints correctly for missing required prop', async () => {
    const [schema, data] = await getSchemaAndData('required', __dirname);
    const errors = evaluateSchema(schema, data);

    const error = new RequiredValidationError(errors[0], {
      data,
      schema,
      propPath: [],
    });

    expect(error.getError()).toMatchSnapshot();
  });
});
