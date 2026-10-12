import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Reads `__fixtures__/<name>/schema.json` and `data.json` beside the tests directory `dirPath`.
export async function getSchemaAndData(
  name: string,
  dirPath: string
): Promise<[schema: any, data: any, json: string]> {
  const fixtureDir = join(dirPath, '..', '__fixtures__', name);
  const schema = JSON.parse(readFileSync(join(fixtureDir, 'schema.json'), 'utf8'));
  const json = readFileSync(join(fixtureDir, 'data.json'), 'utf8');
  const data = JSON.parse(json);

  return [schema, data, json];
}
