import { stripVTControlCharacters } from 'node:util';
import Ajv from 'ajv';
import { describe, it, expect } from 'vite-plus/test';
import { getSchemaAndData } from '../test-helpers';
import betterAjvErrors from '../';

describe('Main', () => {
  it('should output error with reconstructed codeframe', async () => {
    const [schema, data] = await getSchemaAndData('default', __dirname);
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'cli',
      indent: 2,
    });
    expect(res).toMatchSnapshot();
  });

  it('should output error with codeframe', async () => {
    const [schema, data, json] = await getSchemaAndData('default', __dirname);
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'cli',
      json,
    });
    expect(res).toMatchSnapshot();
  });

  it('should output errors for multiple required values', async () => {
    const [schema, data, json] = await getSchemaAndData('multiple-required', __dirname);
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, {
      format: 'cli',
      json,
    });

    expect(res).toMatchSnapshot();
  });

  it('should not throw for non-string values in an enum', () => {
    const schema = { type: 'object', properties: { kind: { enum: [['a', 'b'], 'c'] } } };
    const data = { kind: 'd' };
    const validate = new Ajv().compile(schema);
    expect(validate(data)).toBeFalsy();

    expect(() => betterAjvErrors(schema, data, validate.errors)).not.toThrow();
    const res = betterAjvErrors(schema, data, validate.errors, { format: 'js' });
    expect(res).toEqual([
      {
        start: { line: 1, column: 9, offset: 8 },
        end: { line: 1, column: 12, offset: 11 },
        error: '/kind must be equal to one of the allowed values: a,b, c',
        path: '/kind',
      },
    ]);
  });

  it('should not throw for an enum of null and other non-string values', () => {
    const schema = { type: 'object', properties: { count: { enum: [null, 5] } } };
    const data = { count: 6 };
    const validate = new Ajv().compile(schema);
    expect(validate(data)).toBeFalsy();

    const res = stripVTControlCharacters(betterAjvErrors(schema, data, validate.errors));
    expect(res).toContain('Unexpected value, should be equal to one of the allowed values');
    expect(betterAjvErrors(schema, data, validate.errors, { format: 'js' })).toEqual([
      {
        start: { line: 1, column: 10, offset: 9 },
        end: { line: 1, column: 11, offset: 10 },
        error: '/count must be equal to one of the allowed values: , 5',
        path: '/count',
      },
    ]);
  });

  it('should suggest the only allowed value of an enum when it is not a string', () => {
    const schema = { type: 'object', properties: { count: { enum: [5] } } };
    const data = { count: 6 };
    const validate = new Ajv().compile(schema);
    expect(validate(data)).toBeFalsy();

    const res = stripVTControlCharacters(betterAjvErrors(schema, data, validate.errors));
    expect(res).toContain('Did you mean 5 here?');
  });

  it('should print array indexes in the error path without the element type', () => {
    const schema = {
      type: 'object',
      properties: {
        content: {
          type: 'array',
          items: {
            type: 'object',
            properties: { type: { enum: ['paragraph', 'codeBlock'] }, text: { type: 'string' } },
          },
        },
      },
    };
    const data = { content: [{ type: 'paragarph' }, { type: 'codeBlock', text: 1 }] };
    const validate = new Ajv({ allErrors: true }).compile(schema);
    expect(validate(data)).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, { format: 'js' });
    expect(res.map(({ error }) => error)).toEqual([
      '/content/0/type must be equal to one of the allowed values: paragraph, codeBlock',
      '/content/1/text: type must be string',
    ]);
  });

  it('should point at the last duplicate key when using the json option', () => {
    // JSON.parse keeps the last value of a duplicate key, so that is what ajv validates.
    const json = '{\n  "a": { "b": 1 },\n  "a": { "b": "two" }\n}';
    const data = JSON.parse(json);
    const schema = {
      type: 'object',
      properties: { a: { type: 'object', properties: { b: { type: 'number' } } } },
    };
    const validate = new Ajv().compile(schema);
    expect(validate(data)).toBeFalsy();

    const res = betterAjvErrors(schema, data, validate.errors, { format: 'js', json });
    expect(res).toEqual([
      {
        start: { line: 3, column: 15, offset: 35 },
        end: { line: 3, column: 20, offset: 40 },
        error: '/a/b: type must be number',
        path: '/a/b',
      },
    ]);
  });

  describe('property names with characters outside word characters and -', () => {
    const getErrors = (schema, data) => {
      const validate = new Ajv({ allErrors: true }).compile(schema);
      expect(validate(data)).toBeFalsy();
      return betterAjvErrors(schema, data, validate.errors, { format: 'js' });
    };

    it('reports errors under Unicode keys', () => {
      const schema = { type: 'object', properties: { 名前: { type: 'string', minLength: 2 } } };
      expect(getErrors(schema, { 名前: '' })).toEqual([
        {
          start: { line: 1, column: 7, offset: 6 },
          end: { line: 1, column: 9, offset: 8 },
          error: '/名前: minLength must NOT have fewer than 2 characters',
          path: '/名前',
        },
      ]);
    });

    it('reports errors under keys that contain ~ and /', () => {
      const schema = {
        type: 'object',
        properties: { 'a~b': { type: 'string' }, 'c/d': { type: 'string' } },
      };
      expect(getErrors(schema, { 'a~b': 1, 'c/d': 2 })).toEqual([
        {
          start: { line: 1, column: 8, offset: 7 },
          end: { line: 1, column: 9, offset: 8 },
          error: '/a~b: type must be string',
          path: '/a~0b',
        },
        {
          start: { line: 1, column: 16, offset: 15 },
          end: { line: 1, column: 17, offset: 16 },
          error: '/c/d: type must be string',
          path: '/c~1d',
        },
      ]);
    });

    it('reports errors under $ and empty keys', () => {
      const schema = {
        type: 'object',
        properties: { '': { type: 'string' }, $ref: { type: 'string' } },
      };
      expect(getErrors(schema, { '': 1, $ref: 2 })).toEqual([
        {
          start: { line: 1, column: 5, offset: 4 },
          end: { line: 1, column: 6, offset: 5 },
          error: '/: type must be string',
          path: '/',
        },
        {
          start: { line: 1, column: 14, offset: 13 },
          end: { line: 1, column: 15, offset: 14 },
          error: '/$ref: type must be string',
          path: '/$ref',
        },
      ]);
    });

    it('does not merge a key with a dot into its prefix', () => {
      const schema = {
        type: 'object',
        properties: { a: { type: 'object', required: ['z'] }, 'a.b': { type: 'string' } },
      };
      expect(getErrors(schema, { a: {}, 'a.b': 1 })).toEqual([
        {
          start: { line: 1, column: 6, offset: 5 },
          error: "/a must have required property 'z'",
          path: '/a',
        },
        {
          start: { line: 1, column: 15, offset: 14 },
          end: { line: 1, column: 16, offset: 15 },
          error: '/a.b: type must be string',
          path: '/a.b',
        },
      ]);
    });

    it('drops an enum error when a sibling key such as $schema has an error', () => {
      const schema = {
        type: 'object',
        properties: { kind: { enum: ['alpha', 'beta'] }, $schema: { type: 'string' } },
      };
      expect(getErrors(schema, { kind: 'alpah', $schema: 1 })).toEqual([
        {
          start: { line: 1, column: 27, offset: 26 },
          end: { line: 1, column: 28, offset: 27 },
          error: '/$schema: type must be string',
          path: '/$schema',
        },
      ]);
    });

    it('points at additional properties whose names contain ~ and /', () => {
      const schema = {
        type: 'object',
        properties: { 名前: { type: 'object', additionalProperties: false } },
      };
      const data = { 名前: { 'a/b': 1, 'c~d': 2 } };
      expect(getErrors(schema, data)).toEqual([
        {
          start: { line: 1, column: 8, offset: 7 },
          end: { line: 1, column: 13, offset: 12 },
          error: '/名前 Property a/b is not expected to be here',
          path: '/名前',
        },
        {
          start: { line: 1, column: 16, offset: 15 },
          end: { line: 1, column: 21, offset: 20 },
          error: '/名前 Property c~d is not expected to be here',
          path: '/名前',
        },
      ]);

      const validate = new Ajv({ allErrors: true }).compile(schema);
      validate(data);
      const res = stripVTControlCharacters(betterAjvErrors(schema, data, validate.errors));
      expect(res).toContain('a/b is not expected to be here!');
      expect(res).toContain('c~d is not expected to be here!');
    });

    it('suggests an enum value under a Unicode key', () => {
      const schema = { type: 'object', properties: { 種類: { enum: ['alpha', 'beta'] } } };
      expect(getErrors(schema, { 種類: 'alpah' })).toEqual([
        {
          start: { line: 1, column: 7, offset: 6 },
          end: { line: 1, column: 14, offset: 13 },
          error: '/種類 must be equal to one of the allowed values: alpha, beta',
          path: '/種類',
          suggestion: 'Did you mean alpha?',
        },
      ]);
    });

    it('keeps a key that starts with digits apart from the array index', () => {
      const schema = {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              1: { type: 'object', required: ['id'] },
              '1st': { type: 'string' },
            },
          },
        },
      };
      expect(getErrors(schema, { data: { 1: {}, '1st': 5 } })).toEqual([
        {
          start: { line: 1, column: 14, offset: 13 },
          error: "/data/1 must have required property 'id'",
          path: '/data/1',
        },
        {
          start: { line: 1, column: 23, offset: 22 },
          end: { line: 1, column: 24, offset: 23 },
          error: '/data/1st: type must be string',
          path: '/data/1st',
        },
      ]);
    });
  });
});
