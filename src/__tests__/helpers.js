import { makeTree, filterRedundantErrors } from '../helpers';

describe('makeTree', () => {
  it('works on empty array', async () => {
    expect(makeTree([])).toMatchInlineSnapshot(`
      Object {
        "children": Object {},
      }
    `);
  });

  it('works on root dataPath', async () => {
    expect(makeTree([{ dataPath: '' }])).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "": Object {
            "children": Object {},
            "errors": Array [
              Object {
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
      Object {
        "children": Object {
          "/root": Object {
            "children": Object {
              "/child": Object {
                "children": Object {},
                "errors": Array [
                  Object {
                    "dataPath": "/root/child",
                  },
                ],
              },
            },
            "errors": Array [],
          },
        },
      }
    `);
  });

  it('works on array dataPath', async () => {
    expect(
      makeTree([{ dataPath: '/root/child/0' }, { dataPath: '/root/child/1' }])
    ).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "/root": Object {
            "children": Object {
              "/child/0": Object {
                "children": Object {},
                "errors": Array [
                  Object {
                    "dataPath": "/root/child/0",
                  },
                ],
              },
              "/child/1": Object {
                "children": Object {},
                "errors": Array [
                  Object {
                    "dataPath": "/root/child/1",
                  },
                ],
              },
            },
            "errors": Array [],
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
      Object {
        "children": Object {
          "/root": Object {
            "children": Object {
              "/child/0": Object {
                "children": Object {
                  "/grand-child": Object {
                    "children": Object {},
                    "errors": Array [
                      Object {
                        "dataPath": "/root/child/0/grand-child",
                      },
                    ],
                  },
                },
                "errors": Array [],
              },
              "/child/1": Object {
                "children": Object {
                  "/grand-child": Object {
                    "children": Object {},
                    "errors": Array [
                      Object {
                        "dataPath": "/root/child/1/grand-child",
                      },
                    ],
                  },
                },
                "errors": Array [],
              },
            },
            "errors": Array [],
          },
        },
      }
    `);
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
    expect(tree).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "a": Object {
            "children": Object {},
            "errors": Array [
              Object {
                "keyword": "required",
              },
            ],
          },
        },
      }
    `);
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
    expect(tree).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "a": Object {
            "children": Object {
              "b": Object {
                "children": Object {},
                "errors": Array [
                  Object {
                    "keyword": "required",
                  },
                ],
              },
            },
          },
        },
      }
    `);
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
    expect(tree).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "a": Object {
            "children": Object {
              "b": Object {
                "children": Object {},
                "errors": Array [
                  Object {
                    "keyword": "enum",
                  },
                  Object {
                    "keyword": "enum",
                  },
                ],
              },
            },
          },
        },
      }
    `);
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
    expect(tree).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "a2": Object {
            "children": Object {},
            "errors": Array [
              Object {
                "keyword": "additionalProperty",
              },
            ],
          },
        },
      }
    `);
  });

  it('should handle enum - sibling with nested error', async () => {
    const tree = {
      children: {
        a1: {
          children: {
            b1: {
              children: {},
              errors: [
                {
                  keyword: 'additionalProperty',
                },
              ],
            },
          },
          errors: [],
        },
        a2: {
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
    };
    filterRedundantErrors(tree);
    expect(tree).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "a1": Object {
            "children": Object {
              "b1": Object {
                "children": Object {},
                "errors": Array [
                  Object {
                    "keyword": "additionalProperty",
                  },
                ],
              },
            },
            "errors": Array [],
          },
        },
      }
    `);
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
    expect(tree).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "/object": Object {
            "children": Object {
              "/type": Object {
                "children": Object {},
                "errors": Array [
                  Object {
                    "keyword": "type",
                  },
                  Object {
                    "keyword": "type",
                  },
                  Object {
                    "keyword": "anyOf",
                  },
                ],
              },
            },
            "errors": Array [],
          },
        },
      }
    `);
  });
});
