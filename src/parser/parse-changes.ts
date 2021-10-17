import type Context from './context';
import type { AnyChange } from '../types';

type LineType = AnyChange['type'];

const CHAR_TYPE_MAP: Record<string, LineType> = {
  '+': 'Added',
  '-': 'Deleted',
  ' ': 'Unchanged',
};

export default function parseChanges(ctx: Context): AnyChange[] {
  const changes: AnyChange[] = [];
  while (!ctx.isEof()) {
    const line = ctx.getCurLine()!;
    const index = ctx.getCurLineIndex();
    const type = getLineType(line);
    if (!type) {
      break;
    }
    ctx.nextLine();
    changes.push({
      type,
      content: line.slice(1),
      line: index,
    });
  }
  return changes;
}

function getLineType(line: string): LineType | null {
  return CHAR_TYPE_MAP[line[0]] || null;
}
