import { useState, useCallback } from 'react';

interface CopyButtonProps {
    text: string;
}

function CopyButton({ text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [text]);

    return (
        <button
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy'}
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
    );
}

export default CopyButton;
