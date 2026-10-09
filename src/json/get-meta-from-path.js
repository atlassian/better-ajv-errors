import { getPointers } from './utils';

export default function getMetaFromPath(jsonAst, dataPath, includeIdentifierLocation) {
  const pointers = getPointers(dataPath);
  const lastPointerIndex = pointers.length - 1;
  return pointers.reduce((obj, pointer, idx) => {
    switch (obj.type) {
      case 'Object': {
        // JSON.parse keeps the last of duplicate keys, so that is the one ajv validated.
        const member = obj.members.findLast(child => child.name.value === pointer);
        if (!member) {
          throw new Error(`Couldn't find property ${pointer} of ${dataPath}`);
        }

        const { name, value } = member;
        return includeIdentifierLocation && idx === lastPointerIndex ? name : value;
      }
      case 'Array': {
        const element = obj.elements[pointer];
        return element && element.value;
      }
      default:
        console.log(obj);
    }
  }, jsonAst.body);
}
