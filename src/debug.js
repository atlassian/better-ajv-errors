/* eslint-disable no-console */
let __DEBUG = false;
export const debug = x => (__DEBUG = true && console.log(x));
export const log = x => !__DEBUG && console.log(x);
/* eslint-enable no-console */
