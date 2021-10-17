import type { AnyFileChange } from '../types';
import type Context from './context';
import parseExtendedHeader from './parse-extended-header';
import parseChunks from './parse-chunks';
import parseChangeMarkers from './parse-change-markers';

export default function parseFileChanges(ctx: Context): AnyFileChange[] {
  const changedFiles: AnyFileChange[] = [];
  while (!ctx.isEof()) {
    const changed = parseFileChange(ctx);
    if (!changed) {
      break;
    }
    changedFiles.push(changed);
  }
  return changedFiles;
}

function parseFileChange(ctx: Context): AnyFileChange | undefined {
  if (!isComparisonInputLine(ctx.getCurLine())) {
    return;
  }
  ctx.nextLine();

  let isDeleted = false;
  let isNew = false;
  while (!ctx.isEof()) {
    const extHeader = parseExtendedHeader(ctx);
    if (!extHeader) {
      break;
    }
    if (extHeader === 'deleted') isDeleted = true;
    if (extHeader === 'new file') isNew = true;
  }

  const changeMarkers = parseChangeMarkers(ctx);

  if (!changeMarkers) {
    return;
  }

  const chunks = parseChunks(ctx);

  if (isDeleted) {
    return {
      type: 'DeletedFile',
      chunks,
      path: changeMarkers.deleted,
    };
  } else if (isNew) {
    return {
      type: 'AddedFile',
      chunks,
      path: changeMarkers.added,
    };
  } else {
    return {
      type: 'ChangedFile',
      chunks,
      path: changeMarkers.added,
    };
  }
  return;
}

function isComparisonInputLine(line: string): boolean {
  return line.indexOf('diff --git') === 0;
}
