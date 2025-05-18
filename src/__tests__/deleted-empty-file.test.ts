import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('deleted-empty-file', () => {
  const fixture = getFixture('deleted-empty-file');

  it('parse `deleted-empty-file`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
