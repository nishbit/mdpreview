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
                    }}
                >
                    {content}
                </Markdown>
            </div>
        </div>
    );
}

export default Preview;
