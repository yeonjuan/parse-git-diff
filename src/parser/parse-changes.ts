import { isAdditionLine, isDeletionLine, isUnchangedLine } from './utils';
import Context from './context';
import type { AnyChange } from '../types';

export default function parseChanges(context: Context): AnyChange[] {
  const changes: AnyChange[] = [];
  while (!context.isEof()) {
    const line = context.getCurLine()!;
    const index = context.getCurLineIndex();
    if (isAdditionLine(line)) {
      context.nextLine();
      changes.push({
        type: 'Added',
        content: line.slice(1),
        line: index,
      });
    } else if (isDeletionLine(line)) {
      context.nextLine();
      changes.push({
        type: 'Deleted',
        content: line.slice(1),
        line: index,
      });
    } else if (isUnchangedLine(line)) {
      context.nextLine();
      changes.push({
        type: 'Unchanged',
        content: line.slice(1),
        line: index,
      });
    } else {
      break;
    }
  }
  return changes;
}
