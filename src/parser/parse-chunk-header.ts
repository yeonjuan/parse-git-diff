import { isChunkHeader } from './utils';
import type { Hunk } from '../types';
import type Context from './context';

export default function parseChunkHeader(
  context: Context
): Pick<Hunk, 'addedPos' | 'deletedPos'> | null {
  const line = context.getCurLine();
  if (!line || !isChunkHeader(line)) {
    return null;
  }

  const exec = /^@@\s\-(\d+),?(\d+)?\s\+(\d+),?(\d+)?\s@@\s?/.exec(line);

  if (!exec) {
    return null;
  }

  const [all, delStart, delLines, addStart, addLines] = exec;

  const addedStart = parseInt(addStart, 10);
  const addedPos = {
    start: addedStart,
    lines: addLines === undefined ? addedStart : parseInt(addLines, 10),
  };

  const deletedStart = parseInt(delStart, 10);
  const deletedPos = {
    start: deletedStart,
    lines: delLines === undefined ? deletedStart : parseInt(delLines, 10),
  };

  return {
    addedPos,
    deletedPos,
  };
}
