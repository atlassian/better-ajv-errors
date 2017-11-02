export default class BaseValidationError {
  constructor(options = {}) {
    this.options = options;
  }

  print(schema, data) {
    throw new Error(
      `Implement the 'print' method inside ${this.constructor.name}!`
    );
  }
}
