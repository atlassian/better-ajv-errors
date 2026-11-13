import { styleText } from 'node:util';
import type { Location } from '@humanwhocodes/momoa';
import type { IOutputError } from '../index';
import type { RequiredParams } from '../types';
import BaseValidationError from './base';

export default class RequiredValidationError extends BaseValidationError<RequiredParams> {
  get dependentProperty(): string | undefined {
    const { schemaPath } = this.options;
    if (!schemaPath) return undefined;
    const match = schemaPath.match(/\/(?:dependencies|dependentRequired)\/([^/]+)\/required/);
    if (!match) return undefined;
    return match[1].replace(/~1/g, '/').replace(/~0/g, '~');
  }

  getLocation(dataPath: string = this.instancePath): { start: Location } {
    const { start } = super.getLocation(dataPath);
    return { start };
  }

  print(): string[] {
    const { message, params } = this.options;
    const dep = this.dependentProperty;
    const headerSuffix = dep ? ` (required by '${dep}')` : '';
    const output = [
      styleText('red', styleText('bold', 'REQUIRED') + ' ' + message + headerSuffix) + '\n',
    ];

    const contextReason = dep ? ` (required by '${dep}')` : '';
    return output.concat(
      this.getCodeFrame(
        '☹️  ' +
          styleText('magentaBright', params.missingProperty) +
          ` is missing here${contextReason}!`
      )
    );
  }

  getError(): IOutputError {
    const { message } = this.options;
    const dep = this.dependentProperty;
    const formattedMessage = dep ? `${message} (required by '${dep}')` : (message as string);

    return {
      ...this.getLocation(),
      // ajv leaves `message` out only with its `messages: false` option.
      error: this.withDecoratedPath(formattedMessage),
      path: this.instancePath,
    };
  }
}
