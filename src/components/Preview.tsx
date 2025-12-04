interface PreviewProps {
    content: string;
}

function Preview({ content }: PreviewProps) {
    return (
        <div className="preview-container">
            <div className="panel-header">
                <span className="panel-title">Preview</span>
            </div>
            <div className="preview-content">
                {/* For now, just render raw text - we'll add markdown parsing later */}
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {content || 'Preview will appear here...'}
                </pre>
            </div>
        </div>
    );
}

export default Preview;
