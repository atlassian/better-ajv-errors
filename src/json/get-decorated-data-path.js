import { getPointers } from './utils';

export default function getDecoratedDataPath(jsonAst, dataPath) {
  let decoratedPath = '';
  getPointers(dataPath).reduce((obj, pointer) => {
    switch (obj.type) {
      case 'Object': {
        decoratedPath += `/${pointer}`;
        const filtered = obj.members.filter(
          child => child.name.value === pointer
        );
        if (filtered.length !== 1) {
          throw new Error(`Couldn't find property ${pointer} of ${dataPath}`);
        }
        return filtered[0].value;
      }
      case 'Array': {
        decoratedPath += `/${pointer}${getTypeName(obj.elements[pointer])}`;
        return obj.elements[pointer];
      }
      default:
        // eslint-disable-next-line no-console
        console.log(obj);
    }
  }, jsonAst.body);
  return decoratedPath;
}

function getTypeName(obj) {
  if (!obj || !obj.elements) {
    return '';
  }
  const type = obj.elements.filter(
    child => child && child.name && child.name.value === 'type'
  );

  if (!type.length) {
    return '';
  }

  return (type[0].value && `:${type[0].value.value}`) || '';
}
