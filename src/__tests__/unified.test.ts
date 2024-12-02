import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('unified', () => {
  const fixture = getFixture('unified');

  it('parse `unified', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
