import { createContext, useContext, useRef, useCallback, useState, type ReactNode } from 'react';

interface ScrollSyncContextType {
    registerEditor: (element: HTMLElement | null) => void;
    registerPreview: (element: HTMLElement | null) => void;
    handleEditorScroll: () => void;
    handlePreviewScroll: () => void;
    syncEnabled: boolean;
    toggleSync: () => void;
}

const ScrollSyncContext = createContext<ScrollSyncContextType | null>(null);

const STORAGE_KEY = 'mdpreview-scroll-sync';

function getSavedSyncState(): boolean {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved !== 'false'; // Default to true
    } catch {
        return true;
    }
}

export function ScrollSyncProvider({ children }: { children: ReactNode }) {
    const editorRef = useRef<HTMLElement | null>(null);
    const previewRef = useRef<HTMLElement | null>(null);
    const isScrolling = useRef<'editor' | 'preview' | null>(null);
    const scrollTimeout = useRef<number | null>(null);
    const debounceTimeout = useRef<number | null>(null);
    const [syncEnabled, setSyncEnabled] = useState(getSavedSyncState);

    const registerEditor = useCallback((element: HTMLElement | null) => {
        editorRef.current = element;
    }, []);

    const registerPreview = useCallback((element: HTMLElement | null) => {
        previewRef.current = element;
    }, []);

    const toggleSync = useCallback(() => {
        setSyncEnabled(prev => {
            const newValue = !prev;
            try {
                localStorage.setItem(STORAGE_KEY, String(newValue));
            } catch (e) {
                console.error('Failed to save sync state:', e);
            }
            return newValue;
        });
    }, []);

    const syncScroll = useCallback((source: 'editor' | 'preview') => {
        if (!syncEnabled) return;

        const sourceEl = source === 'editor' ? editorRef.current : previewRef.current;
        const targetEl = source === 'editor' ? previewRef.current : editorRef.current;

        if (!sourceEl || !targetEl) return;

        // Calculate scroll percentage
        const maxScroll = sourceEl.scrollHeight - sourceEl.clientHeight;
        if (maxScroll <= 0) return;

        const scrollPercent = Math.min(1, Math.max(0, sourceEl.scrollTop / maxScroll));

        // Apply to target with requestAnimationFrame for smoothness
        const targetMaxScroll = targetEl.scrollHeight - targetEl.clientHeight;
        if (targetMaxScroll <= 0) return;

        requestAnimationFrame(() => {
            targetEl.scrollTop = scrollPercent * targetMaxScroll;
        });
    }, [syncEnabled]);

    const handleEditorScroll = useCallback(() => {
        if (!syncEnabled) return;
        if (isScrolling.current === 'preview') return;

        // Debounce scroll events
        if (debounceTimeout.current) {
            cancelAnimationFrame(debounceTimeout.current);
        }

        debounceTimeout.current = requestAnimationFrame(() => {
            isScrolling.current = 'editor';
            syncScroll('editor');

            // Reset scrolling flag after a short delay
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            scrollTimeout.current = window.setTimeout(() => {
                isScrolling.current = null;
            }, 100);
        });
    }, [syncEnabled, syncScroll]);

    const handlePreviewScroll = useCallback(() => {
        if (!syncEnabled) return;
        if (isScrolling.current === 'editor') return;

        if (debounceTimeout.current) {
            cancelAnimationFrame(debounceTimeout.current);
        }

        debounceTimeout.current = requestAnimationFrame(() => {
            isScrolling.current = 'preview';
            syncScroll('preview');

            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            scrollTimeout.current = window.setTimeout(() => {
                isScrolling.current = null;
            }, 100);
        });
    }, [syncEnabled, syncScroll]);

    return (
        <ScrollSyncContext.Provider
            value={{
                registerEditor,
                registerPreview,
                handleEditorScroll,
                handlePreviewScroll,
                syncEnabled,
                toggleSync,
            }}
        >
            {children}
        </ScrollSyncContext.Provider>
    );
}

export function useScrollSync() {
    const context = useContext(ScrollSyncContext);
    if (!context) {
        throw new Error('useScrollSync must be used within ScrollSyncProvider');
    }
    return context;
}
