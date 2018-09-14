import * as adfSchema from './adfSchema.json';
import Ajv from 'ajv';
import betterAjvErrors from '../..';
import fs from 'fs';

const ajv = new Ajv({ jsonPointers: true, schemaId: 'auto' });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
const validate = ajv.compile(adfSchema);

const readFilesSync = path => {
  return fs.readdirSync(path).reduce((acc, name) => {
    if (name.match(/\.json$/)) {
      acc.push({
        name,
        data: JSON.parse(fs.readFileSync(`${path}/${name}`, 'utf-8')),
      });
    }

    return acc;
  }, []);
};

describe('Integration Test - ', () => {
  const invalid = readFilesSync(`${__dirname}/invalid`);
  invalid.forEach(file => {
    it(`shows better error for '${file.name}`, () => {
      const valid = validate(file.data);
      expect(valid).toBeFalsy();
      const output = betterAjvErrors(adfSchema, file.data, validate.errors, {
        format: 'js',
      });
      expect(output).toMatchSnapshot();
    });
  });
});
