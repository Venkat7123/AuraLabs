'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, BookOpen, Trash2, ImagePlus, Languages } from 'lucide-react';
import { apiFetch } from '@/utils/api';

const LANG_FLAGS = {
    English: '🇬🇧', Tamil: '🇮🇳', Telugu: '🇮🇳', Kannada: '🇮🇳', Hindi: '🇮🇳',
};

export default function SubjectCard({ subject, onDelete }) {
    const router = useRouter();

    const topics = subject.topics || [];
    const totalTopics = topics.length;
    const passedTopics = topics.filter(t => t.passed).length;
    const progress = totalTopics > 0 ? Math.round((passedTopics / totalTopics) * 100) : 0;

    const currentIdx = topics.findIndex(t => !t.passed);
    const safeIdx = currentIdx === -1 ? (totalTopics > 0 ? totalTopics - 1 : 0) : currentIdx;
    const currentTopic = topics[safeIdx]?.title || 'Getting Started';

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                        {subject.language && subject.language !== 'English' && (
                            <span style={{
                                fontSize: '0.6875rem',
                                fontWeight: 600,
                                color: '#8b5cf6',
                                background: 'rgba(139,92,247,0.1)',
                                padding: '4px 10px',
                                borderRadius: 20,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                            }}>
                                {LANG_FLAGS[subject.language] || '🌐'} {subject.language}
                            </span>
                        )}
                        {onDelete && (
                            <button
                                title="Delete subject"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Delete this subject and all its topics?')) {
                                        onDelete(subject.id);
                                    }
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 4,
                                    borderRadius: 8,
                                    color: 'var(--text-muted)',
                                    transition: 'color 0.15s',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
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

                {/* CTA Row */}
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        className="btn-primary"
                        style={{
                            flex: 1,
                            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                            padding: '10px',
                            fontSize: '0.8125rem',
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            // Record streak activity when user starts learning
                            apiFetch('/api/user/streak', { method: 'POST' }).catch(() => { });
                            router.push(`/subjects/${subject.id}`);
                        }}
                    >
                        <Play size={16} />
                        Learn
                    </button>
                    <button
                        style={{
                            flex: 1,
                            padding: '10px',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-md)',
                            border: `1.5px solid ${colors[0]}30`,
                            background: `${colors[0]}08`,
                            color: colors[0],
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            transition: 'all 0.2s',
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/subjects/${subject.id}/homework`);
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${colors[0]}15`;
                            e.currentTarget.style.borderColor = `${colors[0]}50`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = `${colors[0]}08`;
                            e.currentTarget.style.borderColor = `${colors[0]}30`;
                        }}
                    >
                        <ImagePlus size={16} />
                        Homework
                    </button>
                </div>
            </div>
        </div>
    );
}
