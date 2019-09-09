import { readFileSync } from 'fs';
import parse from 'json-to-ast';
import { getFixturePath } from 'jest-fixtures';
import { getMetaFromPath, getDecoratedDataPath } from '../';

async function loadScenario(n) {
  const fixturePath = await getFixturePath(__dirname, `scenario-${n}.json`);
  return readFileSync(fixturePath, 'utf8');
}

describe('JSON', () => {
  it('can work on simple JSON', async () => {
    const rawJson = await loadScenario(1);
    const jsonAst = parse(rawJson, { loc: true });
    expect(getMetaFromPath(jsonAst, '/foo')).toMatchSnapshot();
    expect(getMetaFromPath(jsonAst, '/foo', true)).toMatchSnapshot();
  });

  it('can work on JSON with a key named value', async () => {
    const rawJson = await loadScenario(2);
    const jsonAst = parse(rawJson, { loc: true });
    expect(getMetaFromPath(jsonAst, '/value')).toMatchSnapshot();
    expect(getMetaFromPath(jsonAst, '/value', true)).toMatchSnapshot();
  });

  it('can work on JSON with a key named meta', async () => {
    const rawJson = await loadScenario(3);
    const jsonAst = parse(rawJson, { loc: true });
    expect(getMetaFromPath(jsonAst, '/meta/isMeta')).toMatchSnapshot();
    expect(getMetaFromPath(jsonAst, '/meta/isMeta', true)).toMatchSnapshot();
  });

  it('can work on JSON with Array', async () => {
    const rawJson = await loadScenario(4);
    const jsonAst = parse(rawJson, { loc: true });
    expect(getMetaFromPath(jsonAst, '/arr/1/foo')).toMatchSnapshot();
    expect(getMetaFromPath(jsonAst, '/arr/1/foo', true)).toMatchSnapshot();
  });

  it('can work on JSON with Array with empty children', async () => {
    const rawJson = await loadScenario(4);
    const jsonAst = parse(rawJson, { loc: true });
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
    const jsonAst = parse(rawJsonWithArrayItem, { loc: true });
    expect(getDecoratedDataPath(jsonAst, '/arr/3')).toMatchSnapshot();
  });

  it('can work with unescaped JSON pointers with ~1', async () => {
    const rawJson = await loadScenario(5);
    const jsonAst = parse(rawJson, { loc: true });
    expect(
      getMetaFromPath(jsonAst, '/foo/~1some~1path/value')
    ).toMatchSnapshot();
  });

  it('can work with unescaped JSON pointers with ~0', async () => {
    const rawJson = await loadScenario(5);
    const jsonAst = parse(rawJson, { loc: true });
    expect(
      getMetaFromPath(jsonAst, '/foo/~0some~0path/value')
    ).toMatchSnapshot();
  });
});
