interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

function Editor({ value, onChange }: EditorProps) {
  return (
    <div className="editor-container">
      <div className="panel-header">
        <span className="panel-title">Editor</span>
      </div>
      <textarea
        className="editor-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your markdown here..."
        spellCheck={false}
      />
    </div>
  );
}

export default Editor;
