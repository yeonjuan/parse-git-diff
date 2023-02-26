import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('message-line', () => {
  const fixture = getFixture('message-line');

  it('parse `message-line`', () => {
    expect(parseGitDiff(fixture)).toMatchSnapshot();
  });
});
