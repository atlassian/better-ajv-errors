import { readFileSync } from 'fs';
import { getFixturePath } from 'jest-fixtures';
import { parse, getMetaFromPath } from '../';

async function loadScenario(n) {
  const fixturePath = await getFixturePath(__dirname, `scenario-${n}.json`);
  return readFileSync(fixturePath, 'utf8');
}

describe('JSON', () => {
  it('can work on simple JSON', async () => {
    const rawJson = await loadScenario(1);
    expect(parse(rawJson)).toMatchSnapshot();
    expect(getMetaFromPath(rawJson, '/foo')).toMatchSnapshot();
  });

  it('can work on JSON with a key named value', async () => {
    const rawJson = await loadScenario(2);
    expect(parse(rawJson)).toMatchSnapshot();
    expect(getMetaFromPath(rawJson, '/value')).toMatchSnapshot();
  });

  it('can work on JSON with a key named meta', async () => {
    const rawJson = await loadScenario(3);
    expect(parse(rawJson)).toMatchSnapshot();
    expect(getMetaFromPath(rawJson, '/meta/isMeta')).toMatchSnapshot();
  });

  it('can work on JSON with Array', async () => {
    const rawJson = await loadScenario(4);
    expect(parse(rawJson)).toMatchSnapshot();
    expect(getMetaFromPath(rawJson, '/arr/1/foo')).toMatchSnapshot();
  });
});
