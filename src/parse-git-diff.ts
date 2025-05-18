import Context from './context.js';
import type {
  GitDiff,
  AnyFileChange,
  AnyLineChange,
  Chunk,
  ChunkRange,
  CombinedChunk,
  AnyChunk,
  FilledGitDiffOptions,
  GitDiffOptions,
} from './types.js';
import {
  ExtendedHeader,
  ExtendedHeaderValues,
  FileType,
  LineType,
} from './constants.js';

export default function parseGitDiff(
  diff: string,
  options?: GitDiffOptions
): GitDiff {
  const ctx = new Context(diff, options);
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
  const comparisonLineParsed = parseComparisonInputLine(ctx);

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
    if (extHeader.type === ExtendedHeader.Deleted) {
      isDeleted = true;
      pathBefore = comparisonLineParsed?.from || '';
    }
    if (extHeader.type === ExtendedHeader.NewFile) {
      isNew = true;
      pathAfter = comparisonLineParsed?.to || '';
    }
    if (extHeader.type === ExtendedHeader.RenameFrom) {
      isRename = true;
      pathBefore = extHeader.path as string;
    }
    if (extHeader.type === ExtendedHeader.RenameTo) {
      isRename = true;
      pathAfter = extHeader.path as string;
    }
  }

  const changeMarkers = parseChangeMarkers(ctx);
  const chunks = parseChunks(ctx);

  if (isDeleted && chunks.length && chunks[0].type === 'BinaryFilesChunk') {
    return {
      type: FileType.Deleted,
      chunks,
      path: chunks[0].pathBefore,
    };
  }
  if (isDeleted) {
    return {
      type: FileType.Deleted,
      chunks,
      path: changeMarkers?.deleted || pathBefore,
    };
  } else if (isNew && chunks.length && chunks[0].type === 'BinaryFilesChunk') {
    return {
      type: FileType.Added,
      chunks,
      path: chunks[0].pathAfter,
    };
  } else if (isNew) {
    return {
      type: FileType.Added,
      chunks,
      path: changeMarkers?.added || pathAfter,
    };
  } else if (isRename) {
    return {
      type: FileType.Renamed,
      pathAfter,
      pathBefore,
      chunks,
    };
  } else if (changeMarkers) {
    return {
      type: FileType.Changed,
      chunks,
      path: changeMarkers.added,
    };
  } else if (
    chunks.length &&
    chunks[0].type === 'BinaryFilesChunk' &&
    chunks[0].pathAfter
  ) {
    return {
      type: FileType.Changed,
      chunks,
      path: chunks[0].pathAfter,
    };
  }

  return;
}

function isComparisonInputLine(line: string): boolean {
  return line.indexOf('diff') === 0;
}

function parseComparisonInputLine(
  ctx: Context
): { from: string; to: string } | null {
  const line = ctx.getCurLine();
  const splitted = line.split(' ').reverse();
  const to = splitted.find((p) => p.startsWith('b/'))?.replace('b/', '');
  const from = splitted.find((p) => p.startsWith('a/'))?.replace('a/', '');
  ctx.nextLine();
  if (to && from) {
    return { to, from };
  }
  return null;
}

function parseChunks(context: Context): AnyChunk[] {
  const chunks: AnyChunk[] = [];

  while (!context.isEof()) {
    const chunk = parseChunk(context);
    if (!chunk) {
      break;
    }
    chunks.push(chunk);
  }
  return chunks;
}

function parseChunk(context: Context): AnyChunk | undefined {
  const chunkHeader = parseChunkHeader(context);
  if (!chunkHeader) {
    return;
  }

  if (chunkHeader.type === 'Normal') {
    const changes = parseChanges(
      context,
      chunkHeader.fromFileRange,
      chunkHeader.toFileRange
    );
    return {
      ...chunkHeader,
      type: 'Chunk',
      changes,
    };
  } else if (
    chunkHeader.type === 'Combined' &&
    chunkHeader.fromFileRangeA &&
    chunkHeader.fromFileRangeB
  ) {
    const changes = parseChanges(
      context,
      chunkHeader.fromFileRangeA.start < chunkHeader.fromFileRangeB.start
        ? chunkHeader.fromFileRangeA
        : chunkHeader.fromFileRangeB,
      chunkHeader.toFileRange
    );
    return {
      ...chunkHeader,
      type: 'CombinedChunk',
      changes,
    };
  } else if (
    chunkHeader.type === 'BinaryFiles' &&
    chunkHeader.fileA &&
    chunkHeader.fileB
  ) {
    return {
      type: 'BinaryFilesChunk',
      pathBefore: chunkHeader.fileA,
      pathAfter: chunkHeader.fileB,
    };
  }
}

function parseExtendedHeader(ctx: Context) {
  if (isComparisonInputLine(ctx.getCurLine())) {
    ctx.nextLine();
  }
  const line = ctx.getCurLine();
  const type = ExtendedHeaderValues.find((v) => line.startsWith(v));

  if (type) {
    ctx.nextLine();
  }

  if (type === ExtendedHeader.RenameFrom || type === ExtendedHeader.RenameTo) {
    return {
      type,
      path: line.slice(`${type} `.length),
    } as const;
  } else if (type) {
    return {
      type,
    } as const;
  }

  return null;
}

function parseChunkHeader(ctx: Context) {
  const line = ctx.getCurLine();
  const normalChunkExec =
    /^@@\s\-(\d+),?(\d+)?\s\+(\d+),?(\d+)?\s@@\s?(.+)?/.exec(line);
  if (!normalChunkExec) {
    const combinedChunkExec =
      /^@@@\s\-(\d+),?(\d+)?\s\-(\d+),?(\d+)?\s\+(\d+),?(\d+)?\s@@@\s?(.+)?/.exec(
        line
      );

    if (!combinedChunkExec) {
      const binaryChunkExec = /^Binary\sfiles\s(.*)\sand\s(.*)\sdiffer$/.exec(
        line
      );
      if (binaryChunkExec) {
        const [all, fileA, fileB] = binaryChunkExec;
        ctx.nextLine();
        return {
          type: 'BinaryFiles',
          fileA: getFilePath(ctx, fileA, 'src'),
          fileB: getFilePath(ctx, fileB, 'dst'),
        } as const;
      }

      return null;
    }

    const [
      all,
      delStartA,
      delLinesA,
      delStartB,
      delLinesB,
      addStart,
      addLines,
      context,
    ] = combinedChunkExec;
    ctx.nextLine();
    return {
      context,
      type: 'Combined',
      fromFileRangeA: getRange(delStartA, delLinesA),
      fromFileRangeB: getRange(delStartB, delLinesB),
      toFileRange: getRange(addStart, addLines),
    } as const;
  }

  const [all, delStart, delLines, addStart, addLines, context] =
    normalChunkExec;
  ctx.nextLine();
  return {
    context,
    type: 'Normal',
    toFileRange: getRange(addStart, addLines),
    fromFileRange: getRange(delStart, delLines),
  };
}

function getRange(start: string, lines?: string) {
  const startNum = parseInt(start, 10);
  return {
    start: startNum,
    lines: lines === undefined ? 1 : parseInt(lines, 10),
  };
}

function parseChangeMarkers(context: Context): {
  deleted: string;
  added: string;
} | null {
  const deleterMarker = parseMarker(context, '--- ');
  const deleted = deleterMarker
    ? getFilePath(context, deleterMarker, 'src')
    : deleterMarker;

  const addedMarker = parseMarker(context, '+++ ');
  const added = addedMarker
    ? getFilePath(context, addedMarker, 'dst')
    : addedMarker;
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
  '+': LineType.Added,
  '-': LineType.Deleted,
  ' ': LineType.Unchanged,
  '\\': LineType.Message,
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
      case LineType.Added: {
        change = {
          type,
          lineAfter: lineAfter++,
          content,
        };
        break;
      }
      case LineType.Deleted: {
        change = {
          type,
          lineBefore: lineBefore++,
          content,
        };
        break;
      }
      case LineType.Unchanged: {
        change = {
          type,
          lineBefore: lineBefore++,
          lineAfter: lineAfter++,
          content,
        };
        break;
      }
      case LineType.Message: {
        change = {
          type,
          content: content.trim(),
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

function getFilePath(ctx: Context, input: string, type: 'src' | 'dst') {
  if (ctx.options.noPrefix) {
    return input;
  }
  if (type === 'src') return input.replace(/^a\//, '');
  if (type === 'dst') return input.replace(/^b\//, '');
}
