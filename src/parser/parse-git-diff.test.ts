import { createContext } from '../test-utils';
import parseGitDiff from './parse-git-diff';

describe('parseGitDiff', () => {
  it('should parse new file.', () => {
    // prettier-ignore
    const src =
`diff --git a/parse-git-diff-test/packages.json b/parse-git-diff-test/packages.json
new file mode 100644
index 0000000..5515040
--- /dev/null
+++ b/parse-git-diff-test/packages.json
@@ -0,0 +1,17 @@
+{
+  "name": "parse-git-diff-test",
+  "version": "1.0.0",
+  "description": "",
+  "main": "index.js",
+  "scripts": {
+    "build": "tsc"
+  },
+  "author": "",
+  "license": "ISC",
+  "dependencies": {
+    "parse-git-diff": "0.0.3"
+  },
+  "devDependencies": {
+    "typescript": "^4.4.4"
+  }
+}`;

    const result = parseGitDiff(src);

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });
});
