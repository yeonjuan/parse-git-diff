import Context from './context';
import * as t from './types';
import { isMetaDataLine, isComparisonInputLine } from './utils';

export function parseGitDiff(diff: string): t.GitDiff {
  const result: t.GitDiff = {
    type: 'GitDiff',
    changedFiles: [],
  };

  const ctx = new Context(diff);
  while (!ctx.isEof()) {
    const line = ctx.getCurLine();

    if (line && (!isComparisonInputLine(line) || isMetaDataLine(line))) {
      ctx.nextLine();
      continue;
    }
  }

  return result;
}

export function parseDeletedFile(context: Context) {}
