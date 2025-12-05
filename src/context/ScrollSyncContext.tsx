import { createContext, useContext, useRef, useCallback, type ReactNode } from 'react';

interface ScrollSyncContextType {
    registerEditor: (element: HTMLElement | null) => void;
    registerPreview: (element: HTMLElement | null) => void;
    handleEditorScroll: () => void;
    handlePreviewScroll: () => void;
}

const ScrollSyncContext = createContext<ScrollSyncContextType | null>(null);

export function ScrollSyncProvider({ children }: { children: ReactNode }) {
    const editorRef = useRef<HTMLElement | null>(null);
    const previewRef = useRef<HTMLElement | null>(null);
    const isScrolling = useRef<'editor' | 'preview' | null>(null);
    const scrollTimeout = useRef<number | null>(null);

    const registerEditor = useCallback((element: HTMLElement | null) => {
        editorRef.current = element;
    }, []);

    const registerPreview = useCallback((element: HTMLElement | null) => {
        previewRef.current = element;
    }, []);

    const syncScroll = useCallback((source: 'editor' | 'preview') => {
        const sourceEl = source === 'editor' ? editorRef.current : previewRef.current;
        const targetEl = source === 'editor' ? previewRef.current : editorRef.current;

        if (!sourceEl || !targetEl) return;

        // Calculate scroll percentage
        const maxScroll = sourceEl.scrollHeight - sourceEl.clientHeight;
        if (maxScroll <= 0) return;

        const scrollPercent = sourceEl.scrollTop / maxScroll;

        // Apply to target
        const targetMaxScroll = targetEl.scrollHeight - targetEl.clientHeight;
        targetEl.scrollTop = scrollPercent * targetMaxScroll;
    }, []);

    const handleEditorScroll = useCallback(() => {
        if (isScrolling.current === 'preview') return;

        isScrolling.current = 'editor';
        syncScroll('editor');

        // Reset scrolling flag after a short delay
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = window.setTimeout(() => {
            isScrolling.current = null;
        }, 50);
    }, [syncScroll]);

    const handlePreviewScroll = useCallback(() => {
        if (isScrolling.current === 'editor') return;

        isScrolling.current = 'preview';
        syncScroll('preview');

        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = window.setTimeout(() => {
            isScrolling.current = null;
        }, 50);
    }, [syncScroll]);

    return (
        <ScrollSyncContext.Provider
            value={{
                registerEditor,
                registerPreview,
                handleEditorScroll,
                handlePreviewScroll,
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
