import { getPointers } from './utils';

export default function getDecoratedDataPath(jsonAst, dataPath) {
  let decoratedPath = '';
  getPointers(dataPath).reduce((obj, pointer) => {
    switch (obj.type) {
      case 'Object': {
        decoratedPath += `/${pointer}`;
        // JSON.parse keeps the last of duplicate keys, so that is the one ajv validated.
        const member = obj.members.findLast(child => child.name.value === pointer);
        if (!member) {
          throw new Error(`Couldn't find property ${pointer} of ${dataPath}`);
        }
        return member.value;
      }
      case 'Array': {
        decoratedPath += `/${pointer}`;
        const element = obj.elements[pointer];
        return element && element.value;
      }
      default:
        console.log(obj);
    }
  }, jsonAst.body);
  return decoratedPath;
}
