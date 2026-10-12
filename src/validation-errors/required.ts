import { styleText } from 'node:util';
import type { Location } from '@humanwhocodes/momoa';
import type { IOutputError } from '../index';
import type { RequiredParams } from '../types';
import BaseValidationError from './base';

export default class RequiredValidationError extends BaseValidationError<RequiredParams> {
  getLocation(dataPath: string = this.instancePath): { start: Location } {
    const { start } = super.getLocation(dataPath);
    return { start };
  }

  print(): string[] {
    const { message, params } = this.options;
    const output = [styleText('red', styleText('bold', 'REQUIRED') + ' ' + message) + '\n'];

    return output.concat(
      this.getCodeFrame(
        '☹️  ' + styleText('magentaBright', params.missingProperty) + ' is missing here!'
      )
    );
  }

  getError(): IOutputError {
    const { message } = this.options;

    return {
      ...this.getLocation(),
      // ajv leaves `message` out only with its `messages: false` option.
      error: this.withDecoratedPath(message as string),
      path: this.instancePath,
    };
  }
}
