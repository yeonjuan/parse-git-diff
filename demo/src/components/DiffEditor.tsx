import React, { FC } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/diff/diff';
import './DiffEditor.css';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const DiffEditor: FC<Props> = ({ value, onChange }) => {
  return (
    <div className="editor-container">
      <CodeMirror
        value={value}
        className="editor"
        options={{
          mode: 'diff',
          lineNumbers: true,
        }}
        onBeforeChange={(editor, data, value) => onChange(value)}
      />
    </div>
  );
};

export default DiffEditor;
