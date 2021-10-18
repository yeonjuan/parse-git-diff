import type Context from './context';
import type { AnyLineChange, ChunkRange } from '../types';

type LineType = AnyLineChange['type'];

const CHAR_TYPE_MAP: Record<string, LineType> = {
  '+': 'AddedLine',
  '-': 'DeletedLine',
  ' ': 'UnchangedLine',
};

export default function parseChanges(
  ctx: Context,
  rangeBefore: ChunkRange,
  rangeAfter: ChunkRange
): AnyLineChange[] {
  const changes: AnyLineChange[] = [];
  let lineBefore = rangeBefore.start;
  let lineAfter = rangeAfter.start;

  while (!ctx.isEof()) {
    const line = ctx.getCurLine()!;
    const type = getLineType(line);
    if (!type) {
      break;
    }
    ctx.nextLine();

    let change: AnyLineChange;
    const content = line.slice(1);
    switch (type) {
      case 'AddedLine': {
        change = {
          type: 'AddedLine',
          lineAfter: lineAfter++,
          content,
        };
        break;
      }
      case 'DeletedLine': {
        change = {
          type: 'DeletedLine',
          lineBefore: lineBefore++,
          content,
        };
        break;
      }
      case 'UnchangedLine': {
        change = {
          type: 'UnchangedLine',
          lineBefore: lineBefore++,
          lineAfter: lineAfter++,
          content,
        };
        break;
      }
    }
    changes.push(change);
  }
  return changes;
}

function getLineType(line: string): LineType | null {
  return CHAR_TYPE_MAP[line[0]] || null;
}
