import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('mode-change', () => {
  it('parse mode-only change', () => {
    const fixture = getFixture('mode-change');
    const result = parseGitDiff(fixture);
    expect(result.files).toHaveLength(1);
    expect(result.files[0]).toMatchObject({
      type: 'ChangedFile',
      path: 'script.sh',
    });
    expect(result).toMatchSnapshot();
  });

  it('parse mode change with content changes', () => {
    const fixture = getFixture('mode-change-with-content');
    const result = parseGitDiff(fixture);
    expect(result.files).toHaveLength(1);
    expect(result.files[0]).toMatchObject({
      type: 'ChangedFile',
      path: 'script.sh',
    });
    expect(result.files[0].chunks).toHaveLength(1);
    expect(result).toMatchSnapshot();
  });

  it('parse mode change followed by another file', () => {
    const fixture = getFixture('mode-change-followed-by-file');
    const result = parseGitDiff(fixture);
    expect(result.files).toHaveLength(2);
    expect(result.files[0]).toMatchObject({
      type: 'ChangedFile',
      path: 'script.sh',
    });
    expect(result.files[1]).toMatchObject({
      type: 'ChangedFile',
      path: 'readme.md',
    });
    expect(result).toMatchSnapshot();
  });
});
