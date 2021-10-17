import type Context from './context';
import type { AnyChange, ChunkRange } from '../types';

type LineType = AnyChange['type'];

const CHAR_TYPE_MAP: Record<string, LineType> = {
  '+': 'Added',
  '-': 'Deleted',
  ' ': 'Unchanged',
};

export default function parseChanges(
  ctx: Context,
  rangeBefore: ChunkRange,
  rangeAfter: ChunkRange
): AnyChange[] {
  const changes: AnyChange[] = [];
  let lineBefore = rangeBefore.start;
  let lineAfter = rangeAfter.start;

  while (!ctx.isEof()) {
    const line = ctx.getCurLine()!;
    const type = getLineType(line);
    if (!type) {
      break;
    }
    ctx.nextLine();

    let change: AnyChange;
    const content = line.slice(1);
    switch (type) {
      case 'Added': {
        change = {
          type: 'Added',
          lineAfter: lineAfter++,
          content,
        };
        break;
      }
      case 'Deleted': {
        change = {
          type: 'Deleted',
          lineBefore: lineBefore++,
          content,
        };
        break;
      }
      case 'Unchanged': {
        change = {
          type: 'Unchanged',
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
