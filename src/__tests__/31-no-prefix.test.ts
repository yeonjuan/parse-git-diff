import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('issue 31-no-prefix', () => {
  const fixture = getFixture('31-no-prefix');

  it('parse `31-no-prefix`', () => {
    expect(parseGitDiff(fixture, { noPrefix: true })).toMatchSnapshot();
  });
});
