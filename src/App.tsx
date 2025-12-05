import { useState, useCallback, useEffect } from 'react';
import Split from 'react-split';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Stats from './components/Stats';
import { useTheme } from './context/ThemeContext';
import { useScrollSync } from './context/ScrollSyncContext';
import ThemeSwitchIcon from './assets/switchtheme.svg';
import './App.css';

const defaultMarkdown = `# Hark! A Markdown Primer

*Wherein we learn the ancient art of formatting text, and pretend we'll remember all of it.*

---

## Formatting, or Lack Thereof

Text can be **bold** (for emphasis), *italic* (for that one word you really want to land), or ***both*** (for divorce announcements).

You may also ~~cross things out~~ when past-you was wrong and present-you is too lazy to delete.

> "I have made this longer than usual because I have not had time to make it shorter."
> 
> — *Blaise Pascal, 1657*

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
>
> — *Martin Fowler, optimistically*

---

## Lists: A Taxonomy of Things

### The Unordered Kind
- Thoughts arrive unbidden
- Sometimes they're useful
  - Often they are not
  - This is fine
    - Everything is fine
- We proceed regardless

### The Ordered Kind
1. Wake up
2. Contemplate existence
3. Make questionable decisions
   1. Regret them immediately
   2. Learn nothing
4. Sleep
5. Repeat

### The Aspirational Kind
- [x] Start project
- [x] Get carried away with scope
- [ ] Actually finish something
- [ ] Touch grass

---

## On the Matter of Quotations

> "The trouble with quotes on the internet is that you can never know if they are genuine."
>
> — *Abraham Lincoln, 1864*

> **A Nested Thought:**
>
> > "I put a quote inside a quote so you can quote while you quote."
> >
> > — *Someone, probably*

---

## The Programmer's Lament

\`\`\`javascript
// A function that works on the first try
// (this comment is aspirational)

function doesThisWork(maybe) {
  try {
    return hopefullyYes(maybe);
  } catch (e) {
    // TODO: fix later
    // NOTE: "later" was 3 years ago
    return "¯\\_(ツ)_/¯";
  }
}
\`\`\`

\`\`\`python
# The eternal struggle
def is_it_a_bug_or_a_feature(behavior):
    """
    Determines the nature of unexpected software behavior.
    
    Returns: Whatever keeps us employed
    """
    if behavior.annoying and behavior.reproducible:
        return "bug"
    elif behavior.annoying and not behavior.reproducible:
        return "cosmic_ray"  # actual thing btw
    else:
        return "feature"
\`\`\`

\`\`\`css
/* The CSS of a thousand sorrows */
.center-this-div {
  /* The following took 3 hours */
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* The below was the first attempt */
  /* margin: auto; */
  /* margin: 0 auto; */
  /* text-align: center; */
  /* position: absolute; */
  /* top: 50%; left: 50%; */
  /* transform: translate(-50%, -50%); */
  /* display: table-cell; */
  /* vertical-align: middle; */
  /* ...I need a moment */
}
\`\`\`

---

## A Scholarly Table

| Term | Definition | Frequency of Use |
|------|------------|-----------------|
| Verily | Indeed, truly | Forsooth: often |
| Forthwith | Immediately, at once | When one meaneth it |
| Henceforth | From this time on | Upon making proclamations |
| Prithee | Please (I pray thee) | When seeking favors |
| Methinks | I think | When waxing philosophical |

---

## A Brief Illustration

\`\`\`
   .-------------------.
   |   KEEP CALM AND   |
   |   FORMAT .md      |
   '-------------------'
         — Ancient Proverb
\`\`\`

---

## Links & Such

Behold, a [link that goes somewhere](https://example.com), and here's some \`inline code\` for when thou needst to reference \`const enlightenment = true\`.

---

## An Image, For Visual Learners

![A vista most pleasing to the eye](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80)

---

## In Closing

Three ways to make a horizontal line, because options:

---

***

___

Remember: *the best markdown is the markdown you actually ship.*

Now go forth and format.
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
        <h1 className="app-title">
          <span className="logo-icon">✒</span>
          <span className="logo-text">Ye Olde Markdown</span>
        </h1>
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



