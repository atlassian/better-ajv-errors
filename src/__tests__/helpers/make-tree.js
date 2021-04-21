import { makeTree } from '../../helpers';

describe('makeTree', () => {
  it('works on empty array', async () => {
    expect(makeTree([])).toMatchInlineSnapshot(`
      Object {
        "children": Object {},
      }
    `);
  });

  it('works on root instancePath', async () => {
    expect(makeTree([{ instancePath: '' }])).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "": Object {
            "children": Object {},
            "errors": Array [
              Object {
                "instancePath": "",
              },
            ],
          },
        },
      }
    `);
  });

  it('works on nested instancePath', async () => {
    expect(makeTree([{ instancePath: '/root/child' }])).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "/root": Object {
            "children": Object {
              "/child": Object {
                "children": Object {},
                "errors": Array [
                  Object {
                    "instancePath": "/root/child",
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

  it('works on array instancePath', async () => {
    expect(
      makeTree([
        { instancePath: '/root/child/0' },
        { instancePath: '/root/child/1' },
      ]),
    ).toMatchInlineSnapshot(`
      Object {
        "children": Object {
          "/root": Object {
            "children": Object {
              "/child/0": Object {
                "children": Object {},
                "errors": Array [
                  Object {
                    "instancePath": "/root/child/0",
                  },
                ],
              },
              "/child/1": Object {
                "children": Object {},
                "errors": Array [
                  Object {
                    "instancePath": "/root/child/1",
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

  it('works on array item instancePath', async () => {
    expect(
      makeTree([
        { instancePath: '/root/child/0/grand-child' },
        { instancePath: '/root/child/1/grand-child' },
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
                        "instancePath": "/root/child/0/grand-child",
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
                        "instancePath": "/root/child/1/grand-child",
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
