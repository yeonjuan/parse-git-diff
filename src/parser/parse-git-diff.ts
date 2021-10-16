import parseChanges from './parse-changes';
import type Context from './context';
import type { GitDiff } from '../types';

export default function parseGitDiff(context: Context): GitDiff {
  const gitDiff: GitDiff = {
    type: 'GitDiff',
    changedFiles: [],
  };
  return gitDiff;
}
