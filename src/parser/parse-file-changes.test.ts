import { createContext } from '../test-utils';
import parseFileChanges from './parse-file-changes';

describe('parseChunkHeader', () => {
  it('should parse normal chunk header.', () => {
    // prettier-ignore
    const src =
`diff --git a/.gitignore b/.gitignore
index dd87e2d..1d2a37f 100644
--- a/.gitignore
+++ b/.gitignore
@@ -1,2 +1,3 @@
 node_modules
 build
+coverage
diff --git a/README.md b/README.md
deleted file mode 100644
index 8229282..0000000
--- a/README.md
+++ /dev/null
@@ -1 +0,0 @@
-# parse-git-diff`;

    const result = parseFileChanges(createContext(src));

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });
});
