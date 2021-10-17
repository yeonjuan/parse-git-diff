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
  let isRename = false;
  let pathBefore = '';
  let pathAfter = '';
  while (!ctx.isEof()) {
    const extHeader = parseExtendedHeader(ctx);
    if (!extHeader) {
      break;
    }
    if (extHeader.type === 'deleted') isDeleted = true;
    if (extHeader.type === 'new file') isNew = true;
    if (extHeader.type === 'rename from') {
      isRename = true;
      pathBefore = extHeader.path;
    }
    if (extHeader.type === 'rename to') {
      isRename = true;
      pathAfter = extHeader.path;
    }
  }

  const changeMarkers = parseChangeMarkers(ctx);
  const chunks = parseChunks(ctx);

  if (isDeleted && changeMarkers) {
    return {
      type: 'DeletedFile',
      chunks,
      path: changeMarkers.deleted,
    };
  } else if (isNew && changeMarkers) {
    return {
      type: 'AddedFile',
      chunks,
      path: changeMarkers.added,
    };
  } else if (isRename) {
    return {
      type: 'RenamedFile',
      pathAfter,
      pathBefore,
      chunks,
    };
  } else if (changeMarkers) {
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
