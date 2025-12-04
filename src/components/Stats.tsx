import { useMemo, useEffect, useRef, useState } from 'react';

interface StatsProps {
    content: string;
}

// Reading speed constants (words per minute)
const SLOW_WPM = 150;   // Slower readers
const FAST_WPM = 250;   // Faster readers

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

// Calculate reading time range
function calculateReadingTime(wordCount: number): { min: number; max: number } {
    const fastTime = Math.ceil(wordCount / FAST_WPM);
    const slowTime = Math.ceil(wordCount / SLOW_WPM);
    return { min: fastTime, max: slowTime };
}

// Format reading time nicely
function formatReadingTime(wordCount: number): string {
    if (wordCount === 0) return '0 min';

    const { min, max } = calculateReadingTime(wordCount);

    if (min === max || min === 0) {
        return `${max} min`;
    }

    if (min < 1 && max < 1) {
        return '<1 min';
    }

    if (min < 1) {
        return `<1-${max} min`;
    }

    return `${min}-${max} min`;
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
    const stats = useMemo(() => {
        const words = countWords(content);
        return {
            words,
            chars: countChars(content),
            paragraphs: countParagraphs(content),
            lines: countLines(content),
            readingTime: formatReadingTime(words),
        };
    }, [content]);

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

                <div className="stat-item" title="Reading time (150-250 WPM)">
                    <span className="stat-value">{stats.readingTime}</span>
                    <span className="stat-label">read</span>
                </div>
            </div>
        </div>
    );
}

export default Stats;
