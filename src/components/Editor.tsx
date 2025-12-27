import { useRef, useCallback, useMemo, useEffect } from 'react';
import { useScrollSync } from '../context/ScrollSyncContext';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  saveStatus?: SaveStatus;
  lastSaved?: Date | null;
  onClear?: () => void;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function Editor({ value, onChange, saveStatus = 'idle', lastSaved, onClear }: EditorProps) {
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

  const getSaveTooltip = () => {
    if (saveStatus === 'saving') return 'Saving...';
    if (saveStatus === 'error') return 'Storage full';
    return 'Saved to local storage';
  };

  return (
    <div className="editor-container">
      <div className="panel-header">
        <span className="panel-title">Script</span>
        <div className="panel-header-actions">
          {/* Save Status */}
          <div
            className={`save-indicator save-indicator--${saveStatus}`}
            title={getSaveTooltip()}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              {saveStatus === 'error' ? (
                <path d="M8 3v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 8.5l2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                </>
              )}
            </svg>
            {lastSaved && saveStatus !== 'error' && (
              <span className="save-indicator-time">{formatTimestamp(lastSaved)}</span>
            )}
          </div>

          {/* Clear Button */}
          {onClear && (
            <button
              className="clear-content-btn"
              onClick={onClear}
              title="Clear all content"
              aria-label="Clear all content"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M3 6h10M5.5 6V13.5H10.5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 4L5.5 2.5H10.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
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
