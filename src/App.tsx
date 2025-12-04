import { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
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

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">MD Preview</h1>
      </header>
      <main className="app-main">
        <Editor value={markdown} onChange={setMarkdown} />
        <Preview content={markdown} />
      </main>
    </div>
  );
}

export default App;
