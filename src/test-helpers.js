import { readFileSync } from 'fs';
import { getFixturePath } from 'jest-fixtures';
import Ajv from 'ajv';

export async function getSchemaAndData(name, dirPath) {
  const schemaPath = await getFixturePath(dirPath, name, 'schema.json');
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  const dataPath = await getFixturePath(dirPath, name, 'data.json');
  const data = JSON.parse(readFileSync(dataPath, 'utf8'));

  return [schema, data];
}

export function evaluateSchema(schema, data) {
  const ajv = new Ajv();
  const fn = ajv.compile(schema);
  fn(data);
  expect(fn.errors.length).toBeGreaterThanOrEqual(0);
  return fn.errors;
}
