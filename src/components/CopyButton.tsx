import { useState, useCallback, useEffect, useRef } from 'react';
import { marked } from 'marked';

interface CopyButtonProps {
    text: string;
}

type CopyFormat = 'markdown' | 'html' | 'plain';

// Strip markdown to plain text
function stripMarkdown(text: string): string {
    return text
        // Remove headers
        .replace(/^#{1,6}\s+/gm, '')
        // Remove bold/italic
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        // Remove strikethrough
        .replace(/~~(.*?)~~/g, '$1')
        // Remove inline code
        .replace(/`([^`]+)`/g, '$1')
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, '')
        // Remove links, keep text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove images
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        // Remove blockquotes
        .replace(/^>\s+/gm, '')
        // Remove horizontal rules
        .replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '')
        // Remove list markers
        .replace(/^[\s]*[-*+]\s+/gm, '')
        .replace(/^[\s]*\d+\.\s+/gm, '')
        // Clean up extra whitespace
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// Convert markdown to HTML
function toHtml(text: string): string {
    return marked.parse(text, { async: false }) as string;
}

function CopyButton({ text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);
    const [copiedFormat, setCopiedFormat] = useState<CopyFormat | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const copyToClipboard = useCallback(async (format: CopyFormat) => {
        try {
            let contentToCopy: string;

            switch (format) {
                case 'html':
                    contentToCopy = toHtml(text);
                    break;
                case 'plain':
                    contentToCopy = stripMarkdown(text);
                    break;
                case 'markdown':
                default:
                    contentToCopy = text;
            }

            await navigator.clipboard.writeText(contentToCopy);
            setCopied(true);
            setCopiedFormat(format);
            setIsOpen(false);
            setTimeout(() => {
                setCopied(false);
                setCopiedFormat(null);
            }, 1200);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [text]);

    // Default copy (markdown)
    const handleClick = useCallback(() => {
        copyToClipboard('markdown');
    }, [copyToClipboard]);

    // Handle dropdown toggle
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcut: Ctrl/Cmd + Shift + C
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                copyToClipboard('markdown');
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [copyToClipboard]);

    const formatLabels: Record<CopyFormat, string> = {
        markdown: 'Markdown',
        html: 'HTML',
        plain: 'Plain text',
    };

    return (
        <div className="copy-button-wrapper" ref={dropdownRef}>
            <button
                className={`copy-button ${copied ? 'copied' : ''}`}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                title={copied ? `Copied as ${formatLabels[copiedFormat!]}!` : 'Copy (right-click for options)'}
                aria-label={copied ? 'Copied' : 'Copy markdown'}
            >
                {copied ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="5.5" y="5.5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10.5 5.5V3.5C10.5 2.95 10.05 2.5 9.5 2.5H3.5C2.95 2.5 2.5 2.95 2.5 3.5V9.5C2.5 10.05 2.95 10.5 3.5 10.5H5.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="copy-dropdown">
                    <button onClick={() => copyToClipboard('markdown')} className="copy-dropdown-item">
                        <span>Markdown</span>
                        <kbd>⌘⇧C</kbd>
                    </button>
                    <button onClick={() => copyToClipboard('html')} className="copy-dropdown-item">
                        <span>HTML</span>
                    </button>
                    <button onClick={() => copyToClipboard('plain')} className="copy-dropdown-item">
                        <span>Plain text</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default CopyButton;
