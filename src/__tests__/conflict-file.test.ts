import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('conflict-file', () => {
  const fixture = getFixture('conflict-file');

  it('parse `conflict-file`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
