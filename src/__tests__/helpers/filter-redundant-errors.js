import { filterRedundantErrors } from '../../helpers';

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
      {
        "children": {
          "a": {
            "children": {},
            "errors": [
              {
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
      {
        "children": {
          "a": {
            "children": {
              "b": {
                "children": {},
                "errors": [
                  {
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
      {
        "children": {
          "a": {
            "children": {
              "b": {
                "children": {},
                "errors": [
                  {
                    "keyword": "enum",
                  },
                  {
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
      {
        "children": {
          "a2": {
            "children": {},
            "errors": [
              {
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
      {
        "children": {
          "a1": {
            "children": {
              "b1": {
                "children": {},
                "errors": [
                  {
                    "keyword": "additionalProperty",
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
      {
        "children": {
          "/object": {
            "children": {
              "/type": {
                "children": {},
                "errors": [
                  {
                    "keyword": "type",
                  },
                  {
                    "keyword": "type",
                  },
                  {
                    "keyword": "anyOf",
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
});
