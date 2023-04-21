import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('chunk-context', () => {
  const fixture = getFixture('chunk-context');

  it('parse `chunk-context`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
