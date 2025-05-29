import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
const { parse } = require('@humanwhocodes/momoa');
import { getFixturePath } from 'jest-fixtures';
import { getMetaFromPath, getDecoratedDataPath } from '../';

async function loadScenario(n) {
  const fixturePath = await getFixturePath(__dirname, `scenario-${n}.json`);
  return parse(readFileSync(fixturePath, 'utf8'));
}

describe('JSON', () => {
  it('can work on simple JSON', async () => {
    const jsonAst = await loadScenario(1);
    expect(getMetaFromPath(jsonAst, '/foo')).toMatchSnapshot();
    expect(getMetaFromPath(jsonAst, '/foo', true)).toMatchSnapshot();
  });

  it('can work on JSON with a key named value', async () => {
    const jsonAst = await loadScenario(2);
    expect(getMetaFromPath(jsonAst, '/value')).toMatchSnapshot();
    expect(getMetaFromPath(jsonAst, '/value', true)).toMatchSnapshot();
  });

  it('can work on JSON with a key named meta', async () => {
    const jsonAst = await loadScenario(3);
    expect(getMetaFromPath(jsonAst, '/meta/isMeta')).toMatchSnapshot();
    expect(getMetaFromPath(jsonAst, '/meta/isMeta', true)).toMatchSnapshot();
  });

  it('can work on JSON with Array', async () => {
    const jsonAst = await loadScenario(4);
    expect(getMetaFromPath(jsonAst, '/arr/1/foo')).toMatchSnapshot();
    expect(getMetaFromPath(jsonAst, '/arr/1/foo', true)).toMatchSnapshot();
  });

  it('can work on JSON with Array with empty children', async () => {
    const jsonAst = await loadScenario(4);
    expect(getDecoratedDataPath(jsonAst, '/arr/4')).toMatchSnapshot();
  });

  it('should not throw error when children is array', async () => {
    const rawJsonWithArrayItem = JSON.stringify({
      foo: 'bar',
      arr: [
        1,
        {
          foo: 'bar',
        },
        3,
        ['anArray'],
      ],
    });
    const jsonAst = parse(rawJsonWithArrayItem);
    expect(getDecoratedDataPath(jsonAst, '/arr/3')).toMatchSnapshot();
  });

  it('can work with unescaped JSON pointers with ~1', async () => {
    const jsonAst = await loadScenario(5);
    expect(
      getMetaFromPath(jsonAst, '/foo/~1some~1path/value')
    ).toMatchSnapshot();
  });

  it('can work with unescaped JSON pointers with ~0', async () => {
    const jsonAst = await loadScenario(5);
    expect(
      getMetaFromPath(jsonAst, '/foo/~0some~0path/value')
    ).toMatchSnapshot();
  });
});
