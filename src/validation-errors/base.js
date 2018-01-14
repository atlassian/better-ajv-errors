export default class BaseValidationError {
  constructor(options = {}, indent = 2) {
    this.options = options;
    this.indent = indent;
  }

  print() {
    throw new Error(
      `Implement the 'print' method inside ${this.constructor.name}!`
    );
  }

  getError() {
    throw new Error(
      `Implement the 'getError' method inside ${this.constructor.name}!`
    );
  }
}
