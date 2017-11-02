let __DEBUG = false;
export const debug = x => (__DEBUG = true && console.log(x));
export const log = x => !__DEBUG && console.log(x);
