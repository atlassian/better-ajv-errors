import { makeTree } from '../../helpers';

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
      makeTree([{ dataPath: '/root/child/0' }, { dataPath: '/root/child/1' }]),
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
      ]),
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
