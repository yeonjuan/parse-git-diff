import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('changed binary file', () => {
  const fixture = getFixture('changed-binary-file');

  it('parse `changed-binary-file`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
