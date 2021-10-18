import type { AnyLineChange, Chunk } from '../types';
import type Context from './context';
import parseChanges from './parse-changes';
import parseChunkHeader from './parse-chunk-header';

export default function parseChunks(context: Context): Chunk[] {
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
