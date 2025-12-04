import { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { useTheme } from './context/ThemeContext';
import './App.css';

const defaultMarkdown = `# Welcome to MD Preview

Start typing your **markdown** here!

## Features
- Live preview
- Syntax highlighting
- GitHub Flavored Markdown

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
`;

function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">MD Preview</h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="app-main">
        <Editor value={markdown} onChange={setMarkdown} />
        <Preview content={markdown} />
      </main>
    </div>
  );
}

export default App;

