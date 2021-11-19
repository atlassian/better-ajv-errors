import {expectType} from 'tsd';
import betterAjvErrors, { IOutputError } from '.';

expectType<string>(betterAjvErrors(true, false, []));
expectType<string>(betterAjvErrors(true, false, [], { format: 'cli'}));

expectType<Array<IOutputError>>(betterAjvErrors('abc', 'xyz', [], { format: 'js'}));
