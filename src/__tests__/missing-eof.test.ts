import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('missing-eof', () => {
  const fixture = getFixture('missing-eof');

  it('parse `missing-eof`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
