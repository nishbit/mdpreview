import { useRef, useCallback, useMemo, useEffect } from 'react';
import { useScrollSync } from '../context/ScrollSyncContext';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

function Editor({ value, onChange }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const { registerEditor, handleEditorScroll } = useScrollSync();

  // Register textarea with scroll sync
  useEffect(() => {
    registerEditor(textareaRef.current);
    return () => registerEditor(null);
  }, [registerEditor]);

  // Calculate line numbers
  const lineNumbers = useMemo(() => {
    const lines = value.split('\n');
    return lines.map((_, index) => index + 1);
  }, [value]);

  // Sync scroll between textarea, line numbers, and preview
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
    handleEditorScroll();
  }, [handleEditorScroll]);

  return (
    <div className="editor-container">
      <div className="panel-header">
        <span className="panel-title">Scriptorium</span>
      </div>
      <div className="editor-content">
        <div className="line-numbers" ref={lineNumbersRef}>
          {lineNumbers.map(num => (
            <div key={num} className="line-number">{num}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder="Begin thy writings here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export default Editor;
