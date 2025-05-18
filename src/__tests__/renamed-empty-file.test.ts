import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('renamed-empty', () => {
  const fixture = getFixture('renamed-empty');

  it('parse `renamed-empty`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
