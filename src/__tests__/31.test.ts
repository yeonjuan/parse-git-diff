import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe.only('issue 31', () => {
  const fixture = getFixture('31');

  it('parse `31`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
