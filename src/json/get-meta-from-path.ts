import type { AnyNode, DocumentNode } from '@humanwhocodes/momoa';
import { getPointers } from './utils';

export default function getMetaFromPath(
  jsonAst: DocumentNode,
  dataPath: string,
  includeIdentifierLocation?: boolean
): AnyNode {
  const pointers = getPointers(dataPath);
  const lastPointerIndex = pointers.length - 1;
  return pointers.reduce<AnyNode>((obj, pointer, idx) => {
    switch (obj.type) {
      case 'Object': {
        // JSON.parse keeps the last of duplicate keys, so that is the one ajv validated.
        const member = obj.members.findLast(
          child => child.name.type === 'String' && child.name.value === pointer
        );
        if (!member) {
          throw new Error(`Couldn't find property ${pointer} of ${dataPath}`);
        }

        const { name, value } = member;
        return includeIdentifierLocation && idx === lastPointerIndex ? name : value;
      }
      case 'Array': {
        const element = obj.elements[Number(pointer)];
        if (!element) {
          throw new Error(`Couldn't find index ${pointer} of ${dataPath}`);
        }
        return element.value;
      }
      default:
        throw new Error(`Couldn't find ${pointer} of ${dataPath}`);
    }
  }, jsonAst.body);
}
