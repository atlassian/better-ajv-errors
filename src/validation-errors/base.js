export default class BaseValidationError {
  constructor(options = {}, indent) {
    this.options = options;
    this.inden = indent;
  }

  print(schema, data) {
    throw new Error(
      `Implement the 'print' method inside ${this.constructor.name}!`
    );
  }
}
