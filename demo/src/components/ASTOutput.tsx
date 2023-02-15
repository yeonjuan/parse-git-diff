import React, { FC } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './ASTOutput.css';
import 'codemirror/mode/javascript/javascript';

const ASTOutput: FC<{
  ast: any;
}> = ({ ast }) => {
  return (
    <div className="ast-output-container">
      <CodeMirror
        options={{
          mode: 'javascript',
          readOnly: true,
          lineNumbers: true,
        }}
        className="ast-output"
        value={JSON.stringify(ast, null, 2)}
      />
    </div>
  );
};

export default ASTOutput;
