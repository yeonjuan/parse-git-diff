![action status](https://github.com/yeonjuan/parse-git-diff/actions/workflows/main.yml/badge.svg?branch=main)
[![npm version](https://badge.fury.io/js/parse-git-diff.svg)](https://www.npmjs.com/package/parse-git-diff)
[![license](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![codecov](https://codecov.io/gh/yeonjuan/parse-git-diff/branch/main/graph/badge.svg?token=J1FUY9P07I)](https://codecov.io/gh/yeonjuan/parse-git-diff)

# parse-git-diff

A parser for git diff.

- [Installation](#installation)
- [Demo](#demo)
- [Usage](#usage)
- [Examples](#examples)
- [AST Format](#ast-format)
- [License](#license)

## Installation

```bash
npm install parse-git-diff
```

## Demo

See [online demo](https://yeonjuan.github.io/parse-git-diff/)

## Usage

```js
import parseGitDiff from 'parse-git-diff'; // import
// or
const parseGitDiff = require('parse-git-diff').default; // require
```

```js
import parseGitDiff from 'parse-git-diff';

const result = parseGitDiff('... git diff ...');

console.log(result);
// {
//   "type": "GitDiff",
//   "files": [
//     {
//       "type": "AddedFile",
//       "chunks": [
//         {
//           "type": "Chunk",
//           "toFileRange": {
//             "start": 1,
// ...
// }
```

### Options

#### `noPrefix` (boolean)

Specifies whether the git diff command is used with the `--no-prefix` option. (default: `false`)

```ts
// git diff HEAD~3 --no-prefix

const result = parseGitDiff(DIFF, {
  noPrefix: true,
});
```

## Examples

<details>
<summary> New file diff </summary>

### Input

<!-- start:new-file-input -->

```diff
diff --git a/newfile.md b/newfile.md
new file mode 100644
index 0000000..aa39060
--- /dev/null
+++ b/newfile.md
@@ -0,0 +1 @@
+newfile
```

<!-- end:new-file-input -->

### Output

<!-- start:new-file-output -->

```json
{
  "type": "GitDiff",
  "files": [
    {
      "type": "AddedFile",
      "chunks": [
        {
          "type": "Chunk",
          "toFileRange": {
            "start": 1,
            "lines": 1
          },
          "fromFileRange": {
            "start": 0,
            "lines": 0
          },
          "changes": [
            {
              "type": "AddedLine",
              "lineAfter": 1,
              "content": "newfile"
            }
          ]
        }
      ],
      "path": "newfile.md"
    }
  ]
}
```

<!-- end:new-file-output -->

</details>

<details>
<summary> Deleted file diff </summary>

### Input

<!-- start:deleted-file-input -->

```diff
diff --git a/newfile.md b/newfile.md
deleted file mode 100644
index aa39060..0000000
--- a/newfile.md
+++ /dev/null
@@ -1 +0,0 @@
-newfile
```

<!-- end:deleted-file-input -->

### Output

<!-- start:deleted-file-output -->

```json
{
  "type": "GitDiff",
  "files": [
    {
      "type": "DeletedFile",
      "chunks": [
        {
          "type": "Chunk",
          "toFileRange": {
            "start": 0,
            "lines": 0
          },
          "fromFileRange": {
            "start": 1,
            "lines": 1
          },
          "changes": [
            {
              "type": "DeletedLine",
              "lineBefore": 1,
              "content": "newfile"
            }
          ]
        }
      ],
      "path": "newfile.md"
    }
  ]
}
```

<!-- end:deleted-file-output -->

</details>

<details>
<summary> Renamed file diff </summary>

### Input

<!-- start:renamed-file-input -->

```diff
diff --git a/newfile.md b/rename.md
similarity index 100%
rename from newfile.md
rename to rename.md
```

<!-- end:renamed-file-input -->

### Output

<!-- start:renamed-file-output -->

```json
{
  "type": "GitDiff",
  "files": [
    {
      "type": "RenamedFile",
      "pathAfter": "rename.md",
      "pathBefore": "newfile.md",
      "chunks": []
    }
  ]
}
```

<!-- end:renamed-file-output -->

</details>

<details>
<summary> Conflict file diff </summary>

### Input

<!-- start:conflict-file-input -->

```diff
diff --cc README.md
index 2445f65,f4b8569..0000000
--- a/README.md
+++ b/README.md
@@@ -8,7 -8,7 +8,11 @@@
  npm install parse-git-diff


++<<<<<<< HEAD
 +## a
++=======
+ ## b
++>>>>>>> branch-b

  - [demo](https://yeonjuan.github.io/parse-git-diff/)


```

<!-- end:conflict-file-input -->

### Output

<!-- start:conflict-file-output -->

```json
{
  "type": "GitDiff",
  "files": [
    {
      "type": "ChangedFile",
      "chunks": [
        {
          "type": "CombinedChunk",
          "fromFileRangeA": {
            "start": 8,
            "lines": 7
          },
          "fromFileRangeB": {
            "start": 8,
            "lines": 7
          },
          "toFileRange": {
            "start": 8,
            "lines": 11
          },
          "changes": [
            {
              "type": "UnchangedLine",
              "lineBefore": 8,
              "lineAfter": 8,
              "content": " npm install parse-git-diff"
            },
            {
              "type": "UnchangedLine",
              "lineBefore": 9,
              "lineAfter": 9,
              "content": " "
            },
            {
              "type": "UnchangedLine",
              "lineBefore": 10,
              "lineAfter": 10,
              "content": " "
            },
            {
              "type": "AddedLine",
              "lineAfter": 11,
              "content": "+<<<<<<< HEAD"
            },
            {
              "type": "UnchangedLine",
              "lineBefore": 11,
              "lineAfter": 12,
              "content": "+## a"
            },
            {
              "type": "AddedLine",
              "lineAfter": 13,
              "content": "+======="
            },
            {
              "type": "AddedLine",
              "lineAfter": 14,
              "content": " ## b"
            },
            {
              "type": "AddedLine",
              "lineAfter": 15,
              "content": "+>>>>>>> branch-b"
            },
            {
              "type": "UnchangedLine",
              "lineBefore": 12,
              "lineAfter": 16,
              "content": " "
            },
            {
              "type": "UnchangedLine",
              "lineBefore": 13,
              "lineAfter": 17,
              "content": " - [demo](https://yeonjuan.github.io/parse-git-diff/)"
            },
            {
              "type": "UnchangedLine",
              "lineBefore": 14,
              "lineAfter": 18,
              "content": " "
            },
            {
              "type": "UnchangedLine",
              "lineBefore": 15,
              "lineAfter": 19,
              "content": " "
            }
          ]
        }
      ],
      "path": "README.md"
    }
  ]
}
```

<!-- end:conflict-file-output -->

</details>

<details>
<summary> New line file diff </summary>

### Input

<!-- start:new-line-input -->

```diff
diff --git a/rename.md b/rename.md
index aa39060..0e05564 100644
--- a/rename.md
+++ b/rename.md
@@ -1 +1,2 @@
 newfile
+newline
```

<!-- end:new-line-input -->

### Output

<!-- start:new-line-output -->

```json
{
  "type": "GitDiff",
  "files": [
    {
      "type": "ChangedFile",
      "chunks": [
        {
          "type": "Chunk",
          "toFileRange": {
            "start": 1,
            "lines": 2
          },
          "fromFileRange": {
            "start": 1,
            "lines": 1
          },
          "changes": [
            {
              "type": "UnchangedLine",
              "lineBefore": 1,
              "lineAfter": 1,
              "content": "newfile"
            },
            {
              "type": "AddedLine",
              "lineAfter": 2,
              "content": "newline"
            }
          ]
        }
      ],
      "path": "rename.md"
    }
  ]
}
```

<!-- end:new-line-output -->

</details>

<details>
<summary> Deleted line file diff </summary>

### Input

<!-- start:deleted-line-input -->

```diff
diff --git a/rename.md b/rename.md
index 0e05564..aa39060 100644
--- a/rename.md
+++ b/rename.md
@@ -1,2 +1 @@
 newfile
-newline
```

<!-- end:deleted-line-input -->

### Output

<!-- start:deleted-line-output -->

```json
{
  "type": "GitDiff",
  "files": [
    {
      "type": "ChangedFile",
      "chunks": [
        {
          "type": "Chunk",
          "toFileRange": {
            "start": 1,
            "lines": 1
          },
          "fromFileRange": {
            "start": 1,
            "lines": 2
          },
          "changes": [
            {
              "type": "UnchangedLine",
              "lineBefore": 1,
              "lineAfter": 1,
              "content": "newfile"
            },
            {
              "type": "DeletedLine",
              "lineBefore": 2,
              "content": "newline"
            }
          ]
        }
      ],
      "path": "rename.md"
    }
  ]
}
```

<!-- end:deleted-line-output -->

<!-- start:message-line-input -->

```diff
diff --git a/rename.md b/rename.md
index 0e05564..aa39060 100644
--- a/rename.md
+++ b/rename.md
@@ -1,2 +1 @@
 newfile
-newline
+newline
\ No newline at end of file
diff --git a/rename2.md b/rename2.md
index 0e05564..aa39060 100644
--- a/rename2.md
+++ b/rename2.md
@@ -1,2 +1 @@
 newfile2
-newline2
+newline2
\ No newline at end of file

```

<!-- end:message-line-input -->

<!-- start:message-line-output -->

```json
{
  "type": "GitDiff",
  "files": [
    {
      "type": "ChangedFile",
      "chunks": [
        {
          "type": "Chunk",
          "toFileRange": {
            "start": 1,
            "lines": 1
          },
          "fromFileRange": {
            "start": 1,
            "lines": 2
          },
          "changes": [
            {
              "type": "UnchangedLine",
              "lineBefore": 1,
              "lineAfter": 1,
              "content": "newfile"
            },
            {
              "type": "DeletedLine",
              "lineBefore": 2,
              "content": "newline"
            },
            {
              "type": "AddedLine",
              "lineAfter": 2,
              "content": "newline"
            },
            {
              "type": "MessageLine",
              "content": "No newline at end of file"
            }
          ]
        }
      ],
      "path": "rename.md"
    },
    {
      "type": "ChangedFile",
      "chunks": [
        {
          "type": "Chunk",
          "toFileRange": {
            "start": 1,
            "lines": 1
          },
          "fromFileRange": {
            "start": 1,
            "lines": 2
          },
          "changes": [
            {
              "type": "UnchangedLine",
              "lineBefore": 1,
              "lineAfter": 1,
              "content": "newfile2"
            },
            {
              "type": "DeletedLine",
              "lineBefore": 2,
              "content": "newline2"
            },
            {
              "type": "AddedLine",
              "lineAfter": 2,
              "content": "newline2"
            },
            {
              "type": "MessageLine",
              "content": "No newline at end of file"
            }
          ]
        }
      ],
      "path": "rename2.md"
    }
  ]
}
```

<!-- end:message-line-output -->

</details>

## AST Format

See the [types.ts](https://github.com/yeonjuan/parse-git-diff/blob/main/src/types.ts) file for all AST formats.

## License

[MIT](./LICENSE)
