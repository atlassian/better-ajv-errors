import { readFileSync } from 'fs';
import parse from 'json-to-ast';
import { getFixturePath } from 'jest-fixtures';
import { getMetaFromPath } from '../';

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
    expect(getMetaFromPath(jsonAst, '/arr/3')).toMatchSnapshot();
  });
});
