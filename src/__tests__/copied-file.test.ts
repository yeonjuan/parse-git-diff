import { getFixture } from './test-utils';
import parseGitDiff from '../parse-git-diff';

describe('copied-file', () => {
  it('preserves an identical copy without content hunks', () => {
    const result = parseGitDiff(getFixture('copied-file'));

    expect(result.files).toHaveLength(1);
    expect(result.files[0]).toMatchObject({
      type: 'CopiedFile',
      pathBefore: 'a-source.txt',
      pathAfter: 'b-copy.txt',
      chunks: [],
    });
  });

  it('preserves the ordinary modification after a copy', () => {
    const result = parseGitDiff(getFixture('copied-file-followed-by-file'));

    expect(result.files).toHaveLength(2);
    expect(result.files[0]).toMatchObject({
      type: 'CopiedFile',
      pathBefore: 'a-source.txt',
      pathAfter: 'b-copy.txt',
    });
    expect(result.files[1]).toMatchObject({
      type: 'ChangedFile',
      path: 'z-followup.txt',
      chunks: [
        {
          changes: [
            { type: 'DeletedLine', content: 'before' },
            { type: 'AddedLine', content: 'after' },
          ],
        },
      ],
    });
  });

  it('preserves changes before and after consecutive copies', () => {
    const fixture = getFixture('copied-file-followed-by-file');
    const copy = getFixture('copied-file');
    const modification = fixture.slice(copy.length);
    const earlierModification = modification.replace(/z-followup/g, 'a-before');
    const anotherCopy = copy.replace(/b-copy\.txt/g, 'c-copy.txt');
    const result = parseGitDiff(
      earlierModification + copy + anotherCopy + modification
    );

    expect(result.files).toHaveLength(4);
    expect(result.files.map((file) => file.type)).toEqual([
      'ChangedFile',
      'CopiedFile',
      'CopiedFile',
      'ChangedFile',
    ]);
    expect(result.files[0]).toMatchObject({ path: 'a-before.txt' });
    expect(result.files[2]).toMatchObject({ pathAfter: 'c-copy.txt' });
    expect(result.files[3]).toMatchObject({ path: 'z-followup.txt' });
  });

  it('preserves source and destination paths and content changes', () => {
    const result = parseGitDiff(getFixture('copied-file-with-content'));

    expect(result.files).toHaveLength(1);
    expect(result.files[0]).toMatchObject({
      type: 'CopiedFile',
      pathBefore: 'source with spaces.txt',
      pathAfter: 'copied with spaces.txt',
    });
    expect(result.files[0].chunks).toHaveLength(1);
    expect(result.files[0].chunks[0]).toMatchObject({
      changes: expect.arrayContaining([
        { type: 'DeletedLine', lineBefore: 5, content: 'five' },
        { type: 'AddedLine', lineAfter: 5, content: 'FIVE' },
      ]),
    });
  });

  it('preserves permission changes on a copied file', () => {
    const result = parseGitDiff(getFixture('copied-file-with-mode'));

    expect(result.files).toHaveLength(1);
    expect(result.files[0]).toMatchObject({
      type: 'CopiedFile',
      pathBefore: 'source with spaces.txt',
      pathAfter: 'copied with spaces.txt',
      oldMode: '100644',
      newMode: '100755',
      chunks: [],
    });
  });

  it('preserves copy paths when noPrefix is enabled', () => {
    const fixture = getFixture('copied-file').replace(
      'diff --git a/a-source.txt b/b-copy.txt',
      'diff --git a-source.txt b-copy.txt'
    );
    const result = parseGitDiff(fixture, { noPrefix: true });

    expect(result.files).toHaveLength(1);
    expect(result.files[0]).toMatchObject({
      type: 'CopiedFile',
      pathBefore: 'a-source.txt',
      pathAfter: 'b-copy.txt',
      chunks: [],
    });
  });
});
