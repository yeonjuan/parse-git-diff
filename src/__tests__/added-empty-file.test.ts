import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('added-empty-file', () => {
  const fixture = getFixture('added-empty-file');

  it('parse `added-empty-file`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
