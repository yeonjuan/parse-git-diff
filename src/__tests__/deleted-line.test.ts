import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('deleted-line', () => {
  const fixture = getFixture('deleted-line');

  it('parse `deleted-line`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
