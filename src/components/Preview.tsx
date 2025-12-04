import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../context/ThemeContext';
import type { ComponentPropsWithoutRef } from 'react';

interface PreviewProps {
    content: string;
}

// Custom Image component with loading state and captions
function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    if (!src) return null;

    return (
        <figure className="image-figure">
            <div className={`image-wrapper ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}>
                {isLoading && !hasError && (
                    <div className="image-skeleton">
                        <div className="skeleton-shimmer" />
                    </div>
                )}
                {hasError ? (
                    <div className="image-error">
                        <span className="error-icon">🖼️</span>
                        <span>Failed to load image</span>
                    </div>
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
            </div>
            {alt && !hasError && <figcaption className="image-caption">{alt}</figcaption>}
        </figure>
    );
}

function Preview({ content }: PreviewProps) {
    const { theme } = useTheme();

    return (
        <div className="preview-container">
            <div className="panel-header">
                <span className="panel-title">Preview</span>
            </div>
            <div className="preview-content markdown-body">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeString = String(children).replace(/\n$/, '');

                            // Check if this is a code block (has language) or inline code
                            const isCodeBlock = match;

                            if (isCodeBlock) {
                                return (
                                    <SyntaxHighlighter
                                        style={theme === 'dark' ? oneDark : oneLight}
                                        language={match[1]}
                                        PreTag="div"
                                        className="syntax-highlighter"
                                        customStyle={{
                                            margin: 0,
                                            padding: '1em',
                                            borderRadius: '8px',
                                            fontSize: '0.9em',
                                        }}
                                    >
                                        {codeString}
                                    </SyntaxHighlighter>
                                );
                            }

                            // Inline code
                            return (
                                <code className="inline-code" {...props}>
                                    {children}
                                </code>
                            );
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

