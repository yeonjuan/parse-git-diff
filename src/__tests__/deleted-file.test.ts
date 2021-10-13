import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('deleted-file', () => {
  const fixture = getFixture('deleted-file');

  it('parse `deleted-file`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
