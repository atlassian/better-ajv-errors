// TODO: Better error handling
export const getPointers = dataPath => {
  return dataPath
    .split('/')
    .slice(1)
    .map(pointer => pointer.split('~1').join('/').split('~0').join('~'));
};
