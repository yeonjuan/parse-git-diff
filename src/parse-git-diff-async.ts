import type { Interface } from 'node:readline';
import {
  BINARY_CHUNK_RE,
  COMBINED_CHUNK_RE,
  ExtendedHeader,
  ExtendedHeaderValues,
  FileType,
  LineType,
  NORMAL_CHUNK_RE,
} from './constants.js';
import { AsyncContext } from './context.js';
import {
  getFilePath,
  getLineType,
  isComparisonInputLine,
} from './parse-git-diff.js';
import type {
  AnyChunk,
  AnyFileChange,
  AnyLineChange,
  ChunkRange,
  GitDiffOptions,
} from './types.js';

export default function parseGitDiff(
  diff: AsyncGenerator<string, any, unknown> | Interface,
  options?: GitDiffOptions
): AsyncGenerator<AnyFileChange, any, unknown> {
  const ctx = new AsyncContext(diff, options);

  return parseFileChanges(ctx);
}

async function* parseFileChanges(
  ctx: AsyncContext
): AsyncGenerator<AnyFileChange, any, unknown> {
  while (!ctx.isEof()) {
    const changed = await parseFileChange(ctx);
    if (!changed) {
      break;
    }
    yield changed;
  }
}

async function parseFileChange(
  ctx: AsyncContext
): Promise<AnyFileChange | undefined> {
  if (!isComparisonInputLine(await ctx.getCurLine())) {
    return;
  }
  await ctx.nextLine();

  let isDeleted = false;
  let isNew = false;
  let isRename = false;
  let pathBefore = '';
  let pathAfter = '';
  while (!ctx.isEof()) {
    const extHeader = await parseExtendedHeader(ctx);
    if (!extHeader) {
      break;
    }
    if (extHeader.type === ExtendedHeader.Deleted) isDeleted = true;
    if (extHeader.type === ExtendedHeader.NewFile) isNew = true;
    if (extHeader.type === ExtendedHeader.RenameFrom) {
      isRename = true;
      pathBefore = extHeader.path as string;
    }
    if (extHeader.type === ExtendedHeader.RenameTo) {
      isRename = true;
      pathAfter = extHeader.path as string;
    }
  }

  const changeMarkers = await parseChangeMarkers(ctx);
  const chunks = await parseChunks(ctx);

  if (isDeleted && changeMarkers) {
    return {
      type: FileType.Deleted,
      chunks,
      path: changeMarkers.deleted,
    };
  } else if (
    isDeleted &&
    chunks.length &&
    chunks[0].type === 'BinaryFilesChunk'
  ) {
    return {
      type: FileType.Deleted,
      chunks,
      path: chunks[0].pathBefore,
    };
  } else if (isNew && changeMarkers) {
    return {
      type: FileType.Added,
      chunks,
      path: changeMarkers.added,
    };
  } else if (isNew && chunks.length && chunks[0].type === 'BinaryFilesChunk') {
    return {
      type: FileType.Added,
      chunks,
      path: chunks[0].pathAfter,
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

async function parseChunks(context: AsyncContext): Promise<AnyChunk[]> {
  const chunks: AnyChunk[] = [];

  while (!context.isEof()) {
    const chunk = await parseChunk(context);
    if (!chunk) {
      break;
    }
    chunks.push(chunk);
  }
  return chunks;
}

async function parseChunk(
  context: AsyncContext
): Promise<AnyChunk | undefined> {
  const chunkHeader = await parseChunkHeader(context);
  if (!chunkHeader) {
    return;
  }

  if (chunkHeader.type === 'Normal') {
    const changes = await parseChanges(
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
    const changes = await parseChanges(
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

async function parseExtendedHeader(ctx: AsyncContext) {
  const line = await ctx.getCurLine();
  const type = ExtendedHeaderValues.find((v) => line.startsWith(v));

  if (type) {
    await ctx.nextLine();
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

async function parseChunkHeader(ctx: AsyncContext) {
  const line = await ctx.getCurLine();
  const normalChunkExec = NORMAL_CHUNK_RE.exec(line);
  if (!normalChunkExec) {
    const combinedChunkExec = COMBINED_CHUNK_RE.exec(line);

    if (!combinedChunkExec) {
      const binaryChunkExec = BINARY_CHUNK_RE.exec(line);
      if (binaryChunkExec) {
        const [all, fileA, fileB] = binaryChunkExec;
        await ctx.nextLine();
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
    await ctx.nextLine();
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
  await ctx.nextLine();
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
    lines: lines === undefined ? startNum : parseInt(lines, 10),
  };
}

async function parseChangeMarkers(context: AsyncContext): Promise<{
  deleted: string;
  added: string;
} | null> {
  const deleterMarker = await parseMarker(context, '--- ');
  const deleted = deleterMarker
    ? getFilePath(context, deleterMarker, 'src')
    : deleterMarker;

  const addedMarker = await parseMarker(context, '+++ ');
  const added = addedMarker
    ? getFilePath(context, addedMarker, 'dst')
    : addedMarker;
  return added && deleted ? { added, deleted } : null;
}

async function parseMarker(
  context: AsyncContext,
  marker: string
): Promise<string | null> {
  const line = await context.getCurLine();
  if (line?.startsWith(marker)) {
    await context.nextLine();
    return line.replace(marker, '');
  }
  return null;
}

type LineType = AnyLineChange['type'];

async function parseChanges(
  ctx: AsyncContext,
  rangeBefore: ChunkRange,
  rangeAfter: ChunkRange
): Promise<AnyLineChange[]> {
  const changes: AnyLineChange[] = [];
  let lineBefore = rangeBefore.start;
  let lineAfter = rangeAfter.start;

  while (!ctx.isEof()) {
    const line = await ctx.getCurLine()!;
    const type = getLineType(line);
    if (!type) {
      break;
    }
    await ctx.nextLine();

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
