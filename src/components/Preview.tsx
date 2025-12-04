import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PreviewProps {
    content: string;
}

function Preview({ content }: PreviewProps) {
    return (
        <div className="preview-container">
            <div className="panel-header">
                <span className="panel-title">Preview</span>
            </div>
            <div className="preview-content markdown-body">
                <Markdown remarkPlugins={[remarkGfm]}>
                    {content}
                </Markdown>
            </div>
        </div>
    );
}

export default Preview;
