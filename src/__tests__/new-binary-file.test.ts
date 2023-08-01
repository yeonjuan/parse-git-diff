import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('new-binary-file', () => {
  const fixture = getFixture('new-binary-file');

  it('parse `new-binary-file`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
