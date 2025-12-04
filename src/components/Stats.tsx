import { useMemo } from 'react';

interface StatsProps {
    content: string;
}

// Count words in text
function countWords(text: string): number {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(word => word.length > 0).length;
}

// Count characters with spaces
function countCharsWithSpaces(text: string): number {
    return text.length;
}

// Count characters without spaces
function countCharsWithoutSpaces(text: string): number {
    return text.replace(/\s/g, '').length;
}

// Count paragraphs (blocks separated by blank lines)
function countParagraphs(text: string): number {
    const trimmed = text.trim();
    if (!trimmed) return 0;

    // Split by 2+ newlines (blank line = paragraph separator)
    const paragraphs = trimmed
        .split(/\n\s*\n/)
        .filter(p => p.trim().length > 0);

    return paragraphs.length;
}

// Count lines (including empty lines)
function countLines(text: string): number {
    if (!text) return 0;
    return text.split('\n').length;
}

function Stats({ content }: StatsProps) {
    const stats = useMemo(() => ({
        words: countWords(content),
        chars: countCharsWithSpaces(content),
        charsNoSpaces: countCharsWithoutSpaces(content),
        paragraphs: countParagraphs(content),
        lines: countLines(content),
    }), [content]);

    return (
        <div className="stats-bar">
            <div className="stats-group">
                <div className="stat-item">
                    <span className="stat-value">{stats.words.toLocaleString()}</span>
                    <span className="stat-label">words</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                    <span className="stat-value">{stats.chars.toLocaleString()}</span>
                    <span className="stat-label">chars</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                    <span className="stat-value">{stats.paragraphs.toLocaleString()}</span>
                    <span className="stat-label">paragraphs</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                    <span className="stat-value">{stats.lines.toLocaleString()}</span>
                    <span className="stat-label">lines</span>
                </div>
            </div>
        </div>
    );
}

export default Stats;
