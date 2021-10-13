import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('new-file', () => {
  const fixture = getFixture('new-file');

  it('parse `new-file`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
