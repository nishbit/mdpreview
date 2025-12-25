import { useState, useCallback, useRef, useEffect, memo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../context/ThemeContext';
import { useScrollSync } from '../context/ScrollSyncContext';
import CopyButton from './CopyButton';
import type { ComponentPropsWithoutRef } from 'react';

interface PreviewProps {
    content: string;
}

// Lazy-loaded code block with syntax highlighting
const LazyCodeBlock = memo(function LazyCodeBlock({ 
    code, 
    language, 
    theme 
}: { 
    code: string; 
    language: string; 
    theme: 'light' | 'dark';
}) {
    const [Highlighter, setHighlighter] = useState<any>(null);
    const [style, setStyle] = useState<any>(null);

    useEffect(() => {
        let mounted = true;
        
        // Dynamically import syntax highlighter only when needed
        Promise.all([
            import('react-syntax-highlighter/dist/esm/light'),
            import('react-syntax-highlighter/dist/esm/styles/hljs'),
            import('react-syntax-highlighter/dist/esm/languages/hljs/javascript'),
            import('react-syntax-highlighter/dist/esm/languages/hljs/typescript'),
            import('react-syntax-highlighter/dist/esm/languages/hljs/python'),
            import('react-syntax-highlighter/dist/esm/languages/hljs/css'),
            import('react-syntax-highlighter/dist/esm/languages/hljs/bash'),
            import('react-syntax-highlighter/dist/esm/languages/hljs/json'),
            import('react-syntax-highlighter/dist/esm/languages/hljs/xml'),
        ]).then(([light, styles, js, ts, py, css, bash, json, xml]) => {
            if (!mounted) return;
            
            const { Light } = light;
            Light.registerLanguage('javascript', js.default);
            Light.registerLanguage('js', js.default);
            Light.registerLanguage('typescript', ts.default);
            Light.registerLanguage('ts', ts.default);
            Light.registerLanguage('python', py.default);
            Light.registerLanguage('css', css.default);
            Light.registerLanguage('bash', bash.default);
            Light.registerLanguage('shell', bash.default);
            Light.registerLanguage('json', json.default);
            Light.registerLanguage('html', xml.default);
            Light.registerLanguage('xml', xml.default);
            
            setHighlighter(() => Light);
            setStyle(theme === 'dark' ? styles.atomOneDark : styles.atomOneLight);
        });
        
        return () => { mounted = false; };
    }, [theme]);

    // Show plain code while loading
    if (!Highlighter || !style) {
        return (
            <pre className="syntax-highlighter" style={{ margin: 0, padding: '1em', fontSize: '0.875em' }}>
                <code>{code}</code>
            </pre>
        );
    }

    return (
        <Highlighter
            style={style}
            language={language}
            PreTag="div"
            className="syntax-highlighter"
            customStyle={{
                margin: 0,
                padding: '1em',
                fontSize: '0.875em',
                background: 'transparent',
            }}
        >
            {code}
        </Highlighter>
    );
});

// Code block copy button
function CodeCopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [code]);

    return (
        <button
            className={`code-copy-button ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title={copied ? 'Verily, copied!' : 'Copy this spell'}
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

// Custom Image component - uses span to avoid p > div nesting issues
function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    if (!src) return null;

    return (
        <span className="image-figure" style={{ display: 'block' }}>
            <span className={`image-wrapper ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`} style={{ display: 'block' }}>
                {isLoading && !hasError && (
                    <span className="image-skeleton" style={{ display: 'block' }}>
                        <span className="skeleton-shimmer" style={{ display: 'block' }} />
                    </span>
                )}
                {hasError ? (
                    <span className="image-error" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2em', color: 'var(--color-text-muted)', gap: '0.5em' }}>
                        <span className="error-icon">!</span>
                        <span>Failed to load image</span>
                    </span>
                ) : (
                    <img
                        src={src}
                        alt={alt || ''}
                        loading="lazy"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                        style={{ opacity: isLoading ? 0 : 1 }}
                    />
                )}
            </span>
            {alt && !hasError && <span className="image-caption" style={{ display: 'block' }}>{alt}</span>}
        </span>
    );
}

function Preview({ content }: PreviewProps) {
    const { theme } = useTheme();
    const previewRef = useRef<HTMLDivElement>(null);
    const { registerPreview, handlePreviewScroll } = useScrollSync();

    // Register preview element with scroll sync
    useEffect(() => {
        registerPreview(previewRef.current);
        return () => registerPreview(null);
    }, [registerPreview]);

    return (
        <div className="preview-container">
            <div className="panel-header">
                <span className="panel-title">Preview</span>
                <CopyButton text={content} />
            </div>
            <div
                className="preview-content markdown-body"
                ref={previewRef}
                onScroll={handlePreviewScroll}
            >
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // Custom paragraph to handle block elements properly
                        p({ children, ...props }) {
                            // Check if children contain block elements (images become spans with display:block)
                            const hasBlockChild = Array.isArray(children)
                                ? children.some((child: any) => child?.type === MarkdownImage || child?.props?.className?.includes('image-figure'))
                                : (children as any)?.type === MarkdownImage;

                            if (hasBlockChild) {
                                return <div {...props}>{children}</div>;
                            }
                            return <p {...props}>{children}</p>;
                        },
                        code({ className, children }: ComponentPropsWithoutRef<'code'>) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeString = String(children).replace(/\n$/, '');
                            const isCodeBlock = match;

                            if (isCodeBlock) {
                                return (
                                    <div className="code-block-wrapper">
                                        <div className="code-block-header">
                                            <span className="code-block-lang">{match[1]}</span>
                                            <CodeCopyButton code={codeString} />
                                        </div>
                                        <LazyCodeBlock 
                                            code={codeString} 
                                            language={match[1]} 
                                            theme={theme} 
                                        />
                                    </div>
                                );
                            }

                            return <code className="inline-code">{children}</code>;
                        },
                        img({ src, alt }) {
                            return <MarkdownImage src={src} alt={alt} />;
                        },
                    }}
                >
                    {content}
                </Markdown>
            </div>
        </div>
    );
}

export default Preview;
