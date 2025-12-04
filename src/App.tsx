import { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Stats from './components/Stats';
import { useTheme } from './context/ThemeContext';
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


function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">MD Preview</h1>
        <Stats content={markdown} />
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Current: ${theme} theme`}
        >
          <img
            src={ThemeSwitchIcon}
            alt="Switch theme"
            className="theme-toggle-icon"
          />
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



