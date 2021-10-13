import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('renamed-file', () => {
  const fixture = getFixture('renamed-file');

  it('parse `renamed-file`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
