import React, { useMemo, useState } from 'react';
import DiffEditor from './components/DiffEditor';
import ASTOutput from './components/ASTOutput';
import parseGitDiff from 'parse-git-diff';
import './App.css';

const INITIAL_VALUE = `diff --git a/newfile.md b/newfile.md
new file mode 100644
index 0000000..aa39060
--- /dev/null
+++ b/newfile.md
@@ -0,0 +1 @@
+newfile
`;

function App() {
  const [value, setValue] = useState<string>(INITIAL_VALUE);
  const ast = useMemo(() => parseGitDiff(value), [value]);

  return (
    <div className="app">
      <header className="header">
        <h1>parse-git-diff</h1>
        <nav className="nav">
          <a href="https://github.com/yeonjuan/parse-git-diff">Github</a>
        </nav>
      </header>
      <main>
        <div className="row">
          <div>
            <h2>Input</h2>
            <DiffEditor value={value} onChange={setValue} />
          </div>
          <div>
            <h2>Output</h2>
            <ASTOutput ast={ast} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
