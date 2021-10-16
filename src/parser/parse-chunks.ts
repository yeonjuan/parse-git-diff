import type { AnyChange, Chunk } from '../types';
import type Context from './context';
import parseChanges from './parse-changes';
import parseChunkHeader from './parse-chunk-header';
import { isChunkHeader } from './utils';

export default function parseChunks(context: Context): Chunk[] {
  const chunks: Chunk[] = [];

  while (!context.isEof()) {
    const line = context.getCurLine();
    if (isChunkHeader(line)) {
      const chunk = parseChunk(context);
      if (!chunk) {
        break;
      }
      chunks.push(chunk);
    } else {
      break;
    }
  }
  return chunks;
}

function parseChunk(context: Context): Chunk | null {
  const chunkHeader = parseChunkHeader(context);

  if (!chunkHeader) {
    return null;
  }

  const changes: AnyChange[] = parseChanges(context);

  return {
    type: 'Chunk',
    ...chunkHeader,
    changes,
  };
}
