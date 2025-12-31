import { test, expectTypeOf } from 'vitest'
import betterAjvErrors, { type IOutputError } from 'better-ajv-errors';

test('types', () => {
  expectTypeOf<string>(betterAjvErrors(true, false, []));
  expectTypeOf<string>(betterAjvErrors(true, false, [], { format: 'cli' }));

  expectTypeOf<Array<IOutputError>>(
    betterAjvErrors('abc', 'xyz', [], { format: 'js' })
  );
});
