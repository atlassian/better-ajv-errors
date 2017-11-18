# better-avj-errors
JSON Schema validation for Human

Main goal of this library is to provide relevant error message like the following:

![Enum Validation Error](https://user-images.githubusercontent.com/208544/32481143-2b4a529a-c3e6-11e7-9797-bb65e9886bce.png)

## Installation
```bash
$ yarn add better-avj-errors
$ # Or
$ npm i better-avj-errors
```

## Usage

```js
import Ajv from 'ajv';
// const Ajv = require('ajv');
import betterAjvErrors from 'better-avj-errors';
// const betterAjvErrors = require('better-avj-errors');

// You need to pass `jsonPointers: true`
const ajv = new Ajv({ jsonPointers: true });

// Load schema and data
const schema = ...;
const data = ...;

const validate = ajv.compile(schema);
const valid = validate(data);
const print = betterAjvErrors({ schema, mode: 'print', indent: 2 });

if (!valid) {
  print(data, validate.errors);
}
```
