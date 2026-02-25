'use client';

import { useRouter } from 'next/navigation';
import { Play, BookOpen } from 'lucide-react';
import { getSubjectProgress, getCurrentTopicIndex } from '@/lib/storage';

export default function SubjectCard({ subject }) {
    const router = useRouter();
    const progress = getSubjectProgress(subject.id);
    const currentIdx = getCurrentTopicIndex(subject.id);
    const currentTopic = subject.syllabus?.[currentIdx]?.title || 'Getting Started';

    const accentColors = [
        ['#6366f1', '#8b5cf6'],
        ['#ec4899', '#f43f5e'],
        ['#10b981', '#14b8a6'],
        ['#f59e0b', '#f97316'],
        ['#06b6d4', '#3b82f6'],
        ['#8b5cf6', '#a855f7'],
    ];
    const colors = accentColors[Math.abs(subject.id?.charCodeAt(0) || 0) % accentColors.length];

    return (
        <div
            className="card"
            style={{
                padding: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
            }}
            onClick={() => router.push(`/subjects/${subject.id}`)}
        >
            {/* Gradient accent top */}
            <div style={{
                height: 4,
                background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
            }} />

            <div style={{ padding: '20px 24px' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                }}>
                    <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `linear-gradient(135deg, ${colors[0]}20, ${colors[1]}20)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <BookOpen size={22} style={{ color: colors[0] }} />
                    </div>
                    <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: colors[0],
                        background: `${colors[0]}15`,
                        padding: '4px 10px',
                        borderRadius: 20,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    }}>
                        {subject.level || 'Beginner'}
                    </span>
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 6,
                    lineHeight: 1.3,
                }}>{subject.name}</h3>

                {/* Current Topic */}
                <p style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: colors[0],
                        flexShrink: 0,
                    }} />
                    {currentTopic}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                    }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: colors[0] }}>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
                        }} />
                    </div>
                </div>

                {/* CTA */}
                <button
                    className="btn-primary"
                    style={{
                        width: '100%',
                        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                        padding: '10px',
                        fontSize: '0.8125rem',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/subjects/${subject.id}`);
                    }}
                >
                    <Play size={16} />
                    Start Learning
                </button>
            </div>
        </div>
    );
}
