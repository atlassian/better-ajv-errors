// Custom JSON parser based on https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
let line;
let column;
let at; // The index of the current character
let ch; // The current character

const META = Symbol('meta');
const VALUE = Symbol('value');

export const getValue = (obj, key) => obj[VALUE][key] || obj[VALUE][VALUE][key];
export const getMeta = obj => obj[META];

const escapee = {
  '"': '"',
  '\\': '\\',
  '/': '/',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
};
let text;

const error = function(m) {
  // Call error when something is wrong.
  throw {
    name: 'SyntaxError',
    message: m,
    at: at,
    text: text,
  };
};

const next = function(c) {
  // If a c parameter is provided, verify that it matches the current character.

  if (c && c !== ch) {
    error("Expected '" + c + "' instead of '" + ch + "'");
  }

  // Get the next character. When there are no more characters,
  // return the empty string.

  ch = text.charAt(at);
  at += 1;
  if (ch === '\n') {
    line += 1;
    column = 0;
  } else {
    column += 1;
  }
  return ch;
};

const number = function() {
  // Parse a number value.

  let value;
  let string = '';

  if (ch === '-') {
    string = '-';
    next('-');
  }
  while (ch >= '0' && ch <= '9') {
    string += ch;
    next();
  }
  if (ch === '.') {
    string += '.';
    while (next() && ch >= '0' && ch <= '9') {
      string += ch;
    }
  }
  if (ch === 'e' || ch === 'E') {
    string += ch;
    next();
    if (ch === '-' || ch === '+') {
      string += ch;
      next();
    }
    while (ch >= '0' && ch <= '9') {
      string += ch;
      next();
    }
  }
  value = +string;
  if (!isFinite(value)) {
    error('Bad number');
  } else {
    return value;
  }
};

const string = function() {
  // Parse a string value.

  let hex;
  let i;
  let value = '';
  let uffff;

  // When parsing for string values, we must look for " and \ characters.

  if (ch === '"') {
    while (next()) {
      if (ch === '"') {
        next();
        return value;
      }
      if (ch === '\\') {
        next();
        if (ch === 'u') {
          uffff = 0;
          for (i = 0; i < 4; i += 1) {
            hex = parseInt(next(), 16);
            if (!isFinite(hex)) {
              break;
            }
            uffff = uffff * 16 + hex;
          }
          value += String.fromCharCode(uffff);
        } else if (typeof escapee[ch] === 'string') {
          value += escapee[ch];
        } else {
          break;
        }
      } else {
        value += ch;
      }
    }
  }
  error('Bad string');
};

const white = function() {
  // Skip whitespace.

  while (ch && ch <= ' ') {
    next();
  }
};

const word = function() {
  // true, false, or null.

  switch (ch) {
    case 't':
      next('t');
      next('r');
      next('u');
      next('e');
      return true;
    case 'f':
      next('f');
      next('a');
      next('l');
      next('s');
      next('e');
      return false;
    case 'n':
      next('n');
      next('u');
      next('l');
      next('l');
      return null;
  }
  error("Unexpected '" + ch + "'");
};

let value; // Place holder for the value function.

const array = function() {
  // Parse an array value.

  const arr = [];
  if (ch === '[') {
    next('[');
    white();
    if (ch === ']') {
      next(']');
      return arr; // empty array
    }
    while (ch) {
      arr.push(value());
      white();
      if (ch === ']') {
        next(']');
        return arr;
      }
      next(',');
      white();
    }
  }
  error('Bad array');
};

const object = function() {
  // Parse an object value.

  let key;
  const obj = {};
  obj[META] = { line, column };
  obj[VALUE] = {};

  if (ch === '{') {
    next('{');
    white();
    if (ch === '}') {
      next('}');
      return obj; // empty object
    }
    while (ch) {
      const c = column;
      key = string();
      white();
      next(':');
      if (Object.hasOwnProperty.call(obj, key)) {
        error("Duplicate key '" + key + "'");
      }
      obj[VALUE][key] = {};
      obj[VALUE][key][META] = { line, column: c };
      obj[VALUE][key][VALUE] = value();
      white();
      if (ch === '}') {
        next('}');
        return obj;
      }
      next(',');
      white();
    }
  }
  error('Bad object');
};

value = function() {
  // Parse a JSON value. It could be an object, an array, a string, a number,
  // or a word.

  white();
  switch (ch) {
    case '{':
      return object();
    case '[':
      return array();
    case '"':
      return string();
    case '-':
      return number();
    default:
      return ch >= '0' && ch <= '9' ? number() : word();
  }
};

// Return the json_parse function. It will have access to all of the above
// functions and variables.
export default source => {
  let result;

  text = source;
  at = 0;
  ch = ' ';
  line = 0;
  column = 0;
  result = value();
  white();
  if (ch) {
    error('Syntax error');
  }
  return result;
};
