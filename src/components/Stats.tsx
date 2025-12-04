import { useMemo } from 'react';

interface StatsProps {
    content: string;
}

// Count words in text
function countWords(text: string): number {
    const trimmed = text.trim();
    if (!trimmed) return 0;

    // Split by whitespace and filter empty strings
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

function Stats({ content }: StatsProps) {
    // Memoize calculations for performance
    const stats = useMemo(() => ({
        words: countWords(content),
        charsWithSpaces: countCharsWithSpaces(content),
        charsWithoutSpaces: countCharsWithoutSpaces(content),
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
                    <span className="stat-value">{stats.charsWithSpaces.toLocaleString()}</span>
                    <span className="stat-label">characters</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                    <span className="stat-value">{stats.charsWithoutSpaces.toLocaleString()}</span>
                    <span className="stat-label">no spaces</span>
                </div>
            </div>
        </div>
    );
}

export default Stats;
