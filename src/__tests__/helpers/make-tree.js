import { describe, it, expect } from 'vite-plus/test';
import { makeTree } from '../../helpers';

describe('makeTree', () => {
  it('works on empty array', async () => {
    expect(makeTree([])).toMatchInlineSnapshot(`
      {
        "children": {},
      }
    `);
  });

  it('works on root dataPath', async () => {
    expect(makeTree([{ dataPath: '' }])).toMatchInlineSnapshot(`
      {
        "children": {
          "": {
            "children": {},
            "errors": [
              {
                "dataPath": "",
              },
            ],
          },
        },
      }
    `);
  });

  it('works on nested dataPath', async () => {
    expect(makeTree([{ dataPath: '/root/child' }])).toMatchInlineSnapshot(`
      {
        "children": {
          "/root": {
            "children": {
              "/child": {
                "children": {},
                "errors": [
                  {
                    "dataPath": "/root/child",
                  },
                ],
              },
            },
            "errors": [],
          },
        },
      }
    `);
  });

  it('keeps escaped, Unicode, $ and empty segments as their own keys', () => {
    const error = { instancePath: '/root/~0tilde/~1slash/名前/$ref/' };
    const tree = makeTree([error]);
    const leaf = ['/root', '/~0tilde', '/~1slash', '/名前', '/$ref', '/'].reduce(
      (node, key) => node.children[key],
      tree
    );
    expect(leaf.errors).toEqual([error]);
  });

  it('only merges whole numeric segments into the key before them', () => {
    const tree = makeTree([
      { instancePath: '/data/1' },
      { instancePath: '/data/1st' },
      { instancePath: '/m/0/1' },
    ]);
    expect(Object.keys(tree.children)).toEqual(['/data/1', '/data', '/m/0']);
    expect(Object.keys(tree.children['/data'].children)).toEqual(['/1st']);
    expect(Object.keys(tree.children['/m/0'].children)).toEqual(['/1']);
  });

  it('ignores paths that are not JSON pointers', () => {
    expect(makeTree([{ dataPath: "['a/ b']" }, { dataPath: '.a.b' }])).toEqual({ children: {} });
  });

  it('works on array dataPath', async () => {
    expect(makeTree([{ dataPath: '/root/child/0' }, { dataPath: '/root/child/1' }]))
      .toMatchInlineSnapshot(`
      {
        "children": {
          "/root": {
            "children": {
              "/child/0": {
                "children": {},
                "errors": [
                  {
                    "dataPath": "/root/child/0",
                  },
                ],
              },
              "/child/1": {
                "children": {},
                "errors": [
                  {
                    "dataPath": "/root/child/1",
                  },
                ],
              },
            },
            "errors": [],
          },
        },
      }
    `);
  });

  it('works on array item dataPath', async () => {
    expect(
      makeTree([
        { dataPath: '/root/child/0/grand-child' },
        { dataPath: '/root/child/1/grand-child' },
      ])
    ).toMatchInlineSnapshot(`
      {
        "children": {
          "/root": {
            "children": {
              "/child/0": {
                "children": {
                  "/grand-child": {
                    "children": {},
                    "errors": [
                      {
                        "dataPath": "/root/child/0/grand-child",
                      },
                    ],
                  },
                },
                "errors": [],
              },
              "/child/1": {
                "children": {
                  "/grand-child": {
                    "children": {},
                    "errors": [
                      {
                        "dataPath": "/root/child/1/grand-child",
                      },
                    ],
                  },
                },
                "errors": [],
              },
            },
            "errors": [],
          },
        },
      }
    `);
  });
});
