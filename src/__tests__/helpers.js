import { makeTree, filterRedundantErrors } from '../helpers';

describe('makeTree', () => {
  it('works on empty array', async () => {
    expect(makeTree([])).toMatchSnapshot();
  });

  it('works on root dataPath', async () => {
    expect(makeTree([{ dataPath: '' }])).toMatchSnapshot();
  });

  it('works on nested dataPath', async () => {
    expect(makeTree([{ dataPath: '/root/child' }])).toMatchSnapshot();
  });

  it('works on array dataPath', async () => {
    expect(
      makeTree([{ dataPath: '/root/child/0' }, { dataPath: '/root/child/1' }])
    ).toMatchSnapshot();
  });

  it('works on array item dataPath', async () => {
    expect(
      makeTree([
        { dataPath: '/root/child/0/grand-child' },
        { dataPath: '/root/child/1/grand-child' },
      ])
    ).toMatchSnapshot();
  });
});

describe('filterRedundantErrors', () => {
  it('should prioritize required', async () => {
    const tree = {
      children: {
        a: {
          children: {
            b: {
              children: {},
              errors: [
                {
                  keyword: 'required',
                },
              ],
            },
          },
          errors: [
            {
              keyword: 'required',
            },
            {
              keyword: 'anyOf',
            },
            {
              keyword: 'enum',
            },
          ],
        },
      },
    };
    filterRedundantErrors(tree);
    expect(tree).toMatchSnapshot();
  });

  it('should handle anyOf', async () => {
    const tree = {
      children: {
        a: {
          children: {
            b: {
              children: {},
              errors: [
                {
                  keyword: 'required',
                },
              ],
            },
          },
          errors: [
            {
              keyword: 'anyOf',
            },
            {
              keyword: 'enum',
            },
          ],
        },
      },
    };
    filterRedundantErrors(tree);
    expect(tree).toMatchSnapshot();
  });

  it('should handle enum', async () => {
    const tree = {
      children: {
        a: {
          children: {
            b: {
              children: {},
              errors: [
                {
                  keyword: 'enum',
                },
                {
                  keyword: 'enum',
                },
              ],
            },
          },
          errors: [
            {
              keyword: 'anyOf',
            },
            {
              keyword: 'additionalProperty',
            },
          ],
        },
      },
    };
    filterRedundantErrors(tree);
    expect(tree).toMatchSnapshot();
  });

  it('should handle enum - sibling', async () => {
    const tree = {
      children: {
        a1: {
          children: {},
          errors: [
            {
              keyword: 'enum',
            },
            {
              keyword: 'enum',
            },
          ],
        },
        a2: {
          children: {},
          errors: [
            {
              keyword: 'additionalProperty',
            },
          ],
        },
      },
    };
    filterRedundantErrors(tree);
    expect(tree).toMatchSnapshot();
  });

  it('should not remove anyOf errors if there are no children', async () => {
    const tree = {
      children: {
        '/object': {
          children: {
            '/type': {
              children: {},
              errors: [
                {
                  keyword: 'type',
                },
                {
                  keyword: 'type',
                },
                {
                  keyword: 'anyOf',
                },
              ],
            },
          },
          errors: [],
        },
      },
    };

    filterRedundantErrors(tree);
    expect(tree).toEqual({
      children: {
        '/object': {
          children: {
            '/type': {
              children: {},
              errors: [
                {
                  keyword: 'type',
                },
                {
                  keyword: 'type',
                },
                {
                  keyword: 'anyOf',
                },
              ],
            },
          },
          errors: [],
        },
      },
    });
  });
});
