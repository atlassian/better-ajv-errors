# better-ajv-errors

JSON Schema validation for Human

[![npm](https://img.shields.io/npm/v/better-ajv-errors.svg?style=flat-square)](https://www.npmjs.com/package/better-ajv-errors)
[![CircleCI](https://img.shields.io/circleci/project/github/torifat/better-ajv-errors.svg?style=flat-square)](https://circleci.com/gh/torifat/better-ajv-errors)
[![Codecov](https://img.shields.io/codecov/c/github/torifat/better-ajv-errors.svg?style=flat-square)](https://codecov.io/gh/torifat/better-ajv-errors)
[![bitHound](https://img.shields.io/bithound/dependencies/github/torifat/better-ajv-errors.svg?style=flat-square)](https://www.bithound.io/github/torifat/better-ajv-errors)

Main goal of this library is to provide relevant error messages like the following:

![Enum Validation Error](https://user-images.githubusercontent.com/208544/32481143-2b4a529a-c3e6-11e7-9797-bb65e9886bce.png)

You can also use it in "return" mode when library returns structured errors.

## Installation

```bash
$ yarn add better-ajv-errors
$ # Or
$ npm i better-ajv-errors
```

Also make sure that you installed [ajv](https://www.npmjs.com/package/ajv) package to validate data against JSON schemas.

## Usage

You need to validate data first with ajv. Then you can pass `validate.errors` object into `better-ajv-errors`.

```js
import Ajv from 'ajv';
// const Ajv = require('ajv');
import betterAjvErrors from 'better-ajv-errors';
// const betterAjvErrors = require('better-ajv-errors');

// You need to pass `jsonPointers: true`
const ajv = new Ajv({ jsonPointers: true });

// Load schema and data
const schema = ...;
const data = ...;

const validate = ajv.compile(schema);
const valid = validate(data);
```

### "Print" mode

```js
// ...validate data first
const print = betterAjvErrors({ schema, mode: 'print', indent: 2 });

if (!valid) {
  print(data, validate.errors);
}
```

### "Return" mode

```js
// ...validate data first
const getHumanErrors = betterAjvErrors({ schema, mode: 'return', indent: 2 });

if (!valid) {
  const errors = getHumanErrors(data, validate.errors);

  /*
  errors is array: [
    {
      "error": "You're using invalid field FOO",
      "line": 14,
      "column": 75,
      "suggestion": "Maybe you meant BAR?"
    }
  ]
  */
}
```
