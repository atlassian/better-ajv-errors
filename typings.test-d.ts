import {expectType} from 'tsd';
import betterAjvErrors, { IOutputError } from '.';

expectType<void>(betterAjvErrors(true, false, []));
expectType<void>(betterAjvErrors(true, false, [], { format: 'cli'}));

expectType<Array<IOutputError>>(betterAjvErrors('foo', 'bar', [], { format: 'js'}));
