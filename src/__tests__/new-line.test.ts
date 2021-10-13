import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('new-line', () => {
  const fixture = getFixture('new-line');

  it('parse `new-line`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
