import Ajv from 'ajv';
import { test, expectTypeOf } from 'vite-plus/test';
import betterAjvErrors, { type IOutputError } from 'better-ajv-errors';

test('types', () => {
  expectTypeOf(betterAjvErrors(true, false, [])).toEqualTypeOf<string>();
  expectTypeOf(betterAjvErrors(true, false, [], { format: 'cli' })).toEqualTypeOf<string>();

  expectTypeOf(betterAjvErrors('abc', 'xyz', [], { format: 'js' })).toEqualTypeOf<
    Array<IOutputError>
  >();
  expectTypeOf<IOutputError['path']>().toEqualTypeOf<string>();
});

test('takes the errors of an ajv validate function', () => {
  const validate = new Ajv().compile({ type: 'string' });
  expectTypeOf(betterAjvErrors({}, 1, validate.errors)).toEqualTypeOf<string>();
});
