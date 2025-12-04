import { useMemo, useEffect, useRef, useState } from 'react';

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
function countChars(text: string): number {
    return text.length;
}

// Count paragraphs (blocks separated by blank lines)
function countParagraphs(text: string): number {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
}

// Count lines
function countLines(text: string): number {
    if (!text) return 0;
    return text.split('\n').length;
}

// Animated number component
function AnimatedNumber({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(value);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevValue = useRef(value);

    useEffect(() => {
        if (prevValue.current !== value) {
            setIsAnimating(true);
            setDisplayValue(value);
            prevValue.current = value;

            const timer = setTimeout(() => setIsAnimating(false), 200);
            return () => clearTimeout(timer);
        }
    }, [value]);

    return (
        <span className={`stat-value ${isAnimating ? 'stat-value-animate' : ''}`}>
            {displayValue.toLocaleString()}
        </span>
    );
}

function Stats({ content }: StatsProps) {
    const stats = useMemo(() => ({
        words: countWords(content),
        chars: countChars(content),
        paragraphs: countParagraphs(content),
        lines: countLines(content),
    }), [content]);

    return (
        <div className="stats-bar">
            <div className="stats-group">
                <div className="stat-item" title="Total words">
                    <AnimatedNumber value={stats.words} />
                    <span className="stat-label">words</span>
                </div>

                <span className="stat-divider">|</span>

                <div className="stat-item" title="Total characters">
                    <AnimatedNumber value={stats.chars} />
                    <span className="stat-label">chars</span>
                </div>

                <span className="stat-divider">|</span>

                <div className="stat-item" title="Paragraphs">
                    <AnimatedNumber value={stats.paragraphs} />
                    <span className="stat-label">para</span>
                </div>

                <span className="stat-divider">|</span>

                <div className="stat-item" title="Lines">
                    <AnimatedNumber value={stats.lines} />
                    <span className="stat-label">lines</span>
                </div>
            </div>
        </div>
    );
}

export default Stats;
