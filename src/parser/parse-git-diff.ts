import Context from './context';
import type { GitDiff } from '../types';
import parseFileChanges from './parse-file-changes';

export default function parseGitDiff(diff: string): GitDiff {
  const ctx = new Context(diff);
  const changedFiles = parseFileChanges(ctx);

  return {
    type: 'GitDiff',
    changedFiles,
  };
}
