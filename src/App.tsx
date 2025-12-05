import { useState, useCallback, useEffect } from 'react';
import Split from 'react-split';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Stats from './components/Stats';
import { useTheme } from './context/ThemeContext';
import { useScrollSync } from './context/ScrollSyncContext';
import ThemeSwitchIcon from './assets/switchtheme.svg';
import './App.css';

const defaultMarkdown = `# Welcome to MD Preview

A beautiful, minimal markdown editor with **live preview**.

## Typography

Regular text with **bold**, *italic*, and ***bold italic*** formatting. You can also use ~~strikethrough~~ text.

### Links & Inline Code

Visit [GitHub](https://github.com) or check the \`README.md\` file. Use \`const x = 42\` for inline code.

---

## Lists

### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
    - Deep nested
- Third item

### Ordered List
1. First step
2. Second step
   1. Sub-step one
   2. Sub-step two
3. Third step

### Task List
- [x] Create the editor
- [x] Add syntax highlighting
- [ ] Implement export feature
- [ ] Add more themes

---

## Blockquotes

> "The best way to predict the future is to create it."
> 
> — *Abraham Lincoln*

> **Note:** Nested blockquotes work too.
>
> > This is a nested quote.

---

## Code Blocks

\`\`\`javascript
// JavaScript example
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

\`\`\`python
# Python example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))
\`\`\`

\`\`\`css
/* CSS example */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
\`\`\`

---

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Editor | ✅ Done | High |
| Preview | ✅ Done | High |
| Themes | ✅ Done | Medium |
| Export | 🔄 In Progress | Low |

---

## Images

![Sunset over mountains](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80)

---

## Horizontal Rules

Use three dashes, asterisks, or underscores:

---

***

___

---

## Headings Reference

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

*Happy writing!* ✨
`;

const STORAGE_KEY = 'mdpreview-split-sizes';
const VIEW_MODE_KEY = 'mdpreview-view-mode';
const DEFAULT_SIZES = [50, 50];

type ViewMode = 'split' | 'editor' | 'preview';

function getSavedSizes(): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const sizes = JSON.parse(saved);
      if (Array.isArray(sizes) && sizes.length === 2) {
        return sizes;
      }
    }
  } catch (e) {
    console.error('Failed to load split sizes:', e);
  }
  return DEFAULT_SIZES;
}

function getSavedViewMode(): ViewMode {
  try {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    if (saved === 'split' || saved === 'editor' || saved === 'preview') {
      return saved;
    }
  } catch (e) {
    console.error('Failed to load view mode:', e);
  }
  return 'split';
}

function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [sizes, setSizes] = useState<number[]>(getSavedSizes);
  const [viewMode, setViewMode] = useState<ViewMode>(getSavedViewMode);
  const { theme, toggleTheme } = useTheme();
  const { syncEnabled, toggleSync } = useScrollSync();

  const handleDragEnd = useCallback((newSizes: number[]) => {
    setSizes(newSizes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSizes));
    } catch (e) {
      console.error('Failed to save split sizes:', e);
    }
  }, []);

  const changeViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_MODE_KEY, mode);
    } catch (e) {
      console.error('Failed to save view mode:', e);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '\\':
            e.preventDefault();
            changeViewMode('split');
            break;
          case 'e':
          case 'E':
            if (e.shiftKey) {
              e.preventDefault();
              changeViewMode('editor');
            }
            break;
          case 'p':
          case 'P':
            if (e.shiftKey) {
              e.preventDefault();
              changeViewMode('preview');
            }
            break;
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [changeViewMode]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">MD Preview</h1>
        <Stats content={markdown} />

        {/* View Mode Toggles */}
        <div className="view-mode-toggles">
          <button
            className={`view-mode-btn ${viewMode === 'editor' ? 'active' : ''}`}
            onClick={() => changeViewMode('editor')}
            title="The Scribe's Chamber — Editor only (Ctrl+Shift+E)"
            aria-label="Editor only"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="5" y1="8" x2="9" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="5" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => changeViewMode('split')}
            title="Side by Side — Split view (Ctrl+\)"
            aria-label="Split view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9" y="2" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => changeViewMode('preview')}
            title="The Looking Glass — Preview only (Ctrl+Shift+P)"
            aria-label="Preview only"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {/* Scroll Sync Toggle */}
        <button
          className={`scroll-sync-toggle ${syncEnabled ? 'active' : ''}`}
          onClick={toggleSync}
          title={syncEnabled ? 'Scrolls move in harmony' : 'Scrolls move freely'}
          aria-label={syncEnabled ? 'Disable scroll sync' : 'Enable scroll sync'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v4M8 10v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 5l3-3 3 3M5 11l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={theme === 'dark' ? 'Summon the daylight' : 'Embrace the shadows'}
        >
          <img
            src={ThemeSwitchIcon}
            alt="Switch theme"
            className="theme-toggle-icon"
          />
        </button>
      </header>

      {/* Conditional View Rendering */}
      {viewMode === 'split' ? (
        <Split
          className="app-main split-container"
          sizes={sizes}
          minSize={200}
          gutterSize={12}
          onDragEnd={handleDragEnd}
          direction="horizontal"
          cursor="col-resize"
        >
          <Editor value={markdown} onChange={setMarkdown} />
          <Preview content={markdown} />
        </Split>
      ) : (
        <main className="app-main single-view">
          {viewMode === 'editor' && <Editor value={markdown} onChange={setMarkdown} />}
          {viewMode === 'preview' && <Preview content={markdown} />}
        </main>
      )}
    </div>
  );
}

export default App;



