import Context from './context';
import type {
  GitDiff,
  AnyFileChange,
  AnyLineChange,
  Chunk,
  ChunkRange,
} from './types';

export default function parseGitDiff(diff: string): GitDiff {
  const ctx = new Context(diff);
  const files = parseFileChanges(ctx);

  return {
    type: 'GitDiff',
    files,
  };
}

function parseFileChanges(ctx: Context): AnyFileChange[] {
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

function parseChunks(context: Context): Chunk[] {
  const chunks: Chunk[] = [];

  while (!context.isEof()) {
    const chunk = parseChunk(context);
    if (!chunk) {
      break;
    }
    chunks.push(chunk);
  }
  return chunks;
}

function parseChunk(context: Context): Chunk | undefined {
  const chunkHeader = parseChunkHeader(context);
  if (!chunkHeader) {
    return;
  }

  const changes: AnyLineChange[] = parseChanges(
    context,
    chunkHeader.rangeBefore,
    chunkHeader.rangeAfter
  );

  return {
    type: 'Chunk',
    ...chunkHeader,
    changes,
  };
}

const UNHANDLED_EXTENDED_HEADERS = new Set([
  'index',
  'old',
  'copy',
  'similarity',
  'dissimilarity',
]);

const startsWith = (str: string, target: string) => {
  return str.indexOf(target) === 0;
};

function parseExtendedHeader(ctx: Context) {
  const line = ctx.getCurLine();
  const type = line.slice(0, line.indexOf(' '));

  if (UNHANDLED_EXTENDED_HEADERS.has(type)) {
    ctx.nextLine();
    return {
      type: 'unhandled',
    } as const;
  }
  if (startsWith(line, 'deleted ')) {
    ctx.nextLine();
    return {
      type: 'deleted',
    } as const;
  } else if (startsWith(line, 'new file ')) {
    ctx.nextLine();
    return {
      type: 'new file',
    } as const;
  } else if (startsWith(line, 'rename from ')) {
    ctx.nextLine();
    return {
      type: 'rename from',
      path: line.slice('rename from '.length),
    } as const;
  } else if (startsWith(line, 'rename to ')) {
    ctx.nextLine();
    return {
      type: 'rename to',
      path: line.slice('rename to '.length),
    } as const;
  }

  return null;
}

function parseChunkHeader(
  ctx: Context
): Pick<Chunk, 'rangeAfter' | 'rangeBefore'> | null {
  const line = ctx.getCurLine();
  const exec = /^@@\s\-(\d+),?(\d+)?\s\+(\d+),?(\d+)?\s@@/.exec(line);
  if (!exec) {
    return null;
  }
  const [all, delStart, delLines, addStart, addLines] = exec;
  ctx.nextLine();
  return {
    rangeAfter: getRange(addStart, addLines),
    rangeBefore: getRange(delStart, delLines),
  };
}

function getRange(start: string, lines?: string) {
  const startNum = parseInt(start, 10);
  return {
    start: startNum,
    lines: lines === undefined ? startNum : parseInt(lines, 10),
  };
}

function parseChangeMarkers(context: Context): {
  deleted: string;
  added: string;
} | null {
  const deleted = parseMarker(context, '--- ')?.replace('a/', '');
  const added = parseMarker(context, '+++ ')?.replace('b/', '');
  return added && deleted ? { added, deleted } : null;
}

function parseMarker(context: Context, marker: string): string | null {
  const line = context.getCurLine();
  if (line?.startsWith(marker)) {
    context.nextLine();
    return line.replace(marker, '');
  }
  return null;
}

type LineType = AnyLineChange['type'];

const CHAR_TYPE_MAP: Record<string, LineType> = {
  '+': 'AddedLine',
  '-': 'DeletedLine',
  ' ': 'UnchangedLine',
};

function parseChanges(
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
