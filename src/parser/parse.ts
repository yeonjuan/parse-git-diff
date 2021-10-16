import Context from './context';
import parseGitDiff from './parse-git-diff';

export default function parse(diff: string) {
  const context = new Context(diff);
  return parseGitDiff(context);
}
