import parseGitDiff from '../parse-git-diff';
import { ChangedFile, RenamedFile } from '../types';

const getDiffFixture = ({
  srcPrefix = 'a/',
  dstPrefix = 'b/',
}) => `diff --git ${srcPrefix}b/bbb.md ${dstPrefix}b/bbb.md
index 0e05564..aa39060 100644
--- ${srcPrefix}b/bbb.md
+++ ${dstPrefix}b/bbb.md
@@ -1,2 +1 @@
 newfile
-newline
+newline
\ No newline at end of file`;

describe('options', () => {
  it('noPrefix=true', () => {
    const output = parseGitDiff(
      getDiffFixture({ srcPrefix: '', dstPrefix: '' }),
      {
        noPrefix: true,
      }
    );

    expect((output.files[0] as ChangedFile).path).toBe('b/bbb.md');
  });

  it('noPrefix=false', () => {
    const output = parseGitDiff(
      getDiffFixture({ srcPrefix: 'a/', dstPrefix: 'b/' }),
      {
        noPrefix: false,
      }
    );

    expect((output.files[0] as ChangedFile).path).toBe('b/bbb.md');
  });
});
