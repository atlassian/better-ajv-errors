import { getFixturePath } from 'jest-fixtures';
import { readFileSync } from 'fs';

import RequiredValidationError from '../required';

async function getSchemaAndData(name) {
  const schemaPath = await getFixturePath(__dirname, name, 'schema.json');
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  const dataPath = await getFixturePath(__dirname, name, 'data.json');
  const data = JSON.parse(readFileSync(dataPath, 'utf8'));
  return [schema, data];
}

describe('Required', () => {
  it('prints correctly for missing required prop', async () => {
    const [schema, data] = await getSchemaAndData('required');

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
