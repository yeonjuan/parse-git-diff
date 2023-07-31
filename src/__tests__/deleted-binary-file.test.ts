import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('deleted binary file', () => {
  const fixture = getFixture('deleted-binary-file');

  it('parse `deleted-binary-file`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
