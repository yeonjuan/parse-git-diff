import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('aa', () => {
  const fixture = getFixture('all');

  it('parse `all`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
