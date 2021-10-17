import type { Chunk } from '../types';
import type Context from './context';

export default function parseChunkHeader(
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
