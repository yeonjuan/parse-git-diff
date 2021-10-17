import { createContext } from '../test-utils';
import parseGitDiff from './parse-git-diff';

describe('parseGitDiff', () => {
  it('new file.', () => {
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

  it('deleted file', () => {
    // prettier-ignore
    const src =
    `diff --git a/parse-git-diff-test/package.json b/parse-git-diff-test/package.json
  deleted file mode 100644
  index 5515040..0000000
  --- a/parse-git-diff-test/package.json
  +++ /dev/null
  @@ -1,17 +0,0 @@
  -{
  -  "name": "parse-git-diff-test",
  -  "version": "1.0.0",
  -  "description": "",
  -  "main": "index.js",
  -  "scripts": {
  -    "build": "tsc"
  -  },
  -  "author": "",
  -  "license": "ISC",
  -  "dependencies": {
  -    "parse-git-diff": "0.0.3"
  -  },
  -  "devDependencies": {
  -    "typescript": "^4.4.4"
  -  }
  -}`;
    const result = parseGitDiff(src);

    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });

  it('rename', () => {
    // prettier-ignore
    const src =
`diff --git a/parse-git-diff-test/tsconfig.json b/parse-git-diff-test/ts.json
similarity index 100%
rename from parse-git-diff-test/tsconfig.json
rename to parse-git-diff-test/ts.json`;
    const result = parseGitDiff(src);
    expect(result).not.toBe(null);
    expect(result).toMatchSnapshot();
  });
});
