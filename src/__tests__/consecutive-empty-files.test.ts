import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('consecutive-empty-files', () => {
  const fixture = getFixture('consecutive-empty-files');

  it('parse `consecutive-empty-files`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
