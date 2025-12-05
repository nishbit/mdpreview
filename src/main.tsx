import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { ScrollSyncProvider } from './context/ScrollSyncContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ScrollSyncProvider>
        <App />
      </ScrollSyncProvider>
    </ThemeProvider>
  </StrictMode>,
)

