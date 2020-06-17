import { capitalize, getLastSegment } from './utils';
import pointer from 'jsonpointer';

export default class BaseValidationError {
  constructor(
    options = { isIdentifierLocation: false },
    { data, schema, propPath },
  ) {
    this.options = options;
    this.data = data;
    this.schema = schema;
    this.propPath = propPath;
  }

  getError() {
    throw new Error(
      `Implement the 'getError' method inside ${this.constructor.name}!`,
    );
  }

  getPrettyPropertyName(dataPath) {
    const propName = this.getPropertyName(dataPath);

    if (propName === null) {
      return capitalize(typeof this.getPropertyValue(dataPath));
    }

    return `\`${propName}\` property`;
  }

  getPropertyName(path) {
    const propName = getLastSegment(path);
    if (propName !== null) {
      return propName;
    }

    if (this.propPath.length === 0) {
      return null;
    }

    return this.propPath[this.propPath.length - 1];
  }

  getPropertyValue(path) {
    return path === '' ? this.data : pointer.get(this.data, path);
  }
}
