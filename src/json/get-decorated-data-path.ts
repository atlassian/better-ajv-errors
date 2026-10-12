import type { DocumentNode, ValueNode } from '@humanwhocodes/momoa';
import { getPointers } from './utils';

export default function getDecoratedDataPath(jsonAst: DocumentNode, dataPath: string): string {
  let decoratedPath = '';
  getPointers(dataPath).reduce<ValueNode | undefined>((obj, pointer) => {
    switch (obj?.type) {
      case 'Object': {
        decoratedPath += `/${pointer}`;
        // JSON.parse keeps the last of duplicate keys, so that is the one ajv validated.
        const member = obj.members.findLast(
          child => child.name.type === 'String' && child.name.value === pointer
        );
        if (!member) {
          throw new Error(`Couldn't find property ${pointer} of ${dataPath}`);
        }
        return member.value;
      }
      case 'Array': {
        decoratedPath += `/${pointer}`;
        return obj.elements[Number(pointer)]?.value;
      }
      default:
        throw new Error(`Couldn't find ${pointer} of ${dataPath}`);
    }
  }, jsonAst.body);
  return decoratedPath;
}
