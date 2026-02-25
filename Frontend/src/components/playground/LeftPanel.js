'use client';

import { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Lock, ChevronDown, ChevronRight, FileText, Image as ImageIcon, BookOpen } from 'lucide-react';
import { isTopicPassed, getSubjectProgress } from '@/lib/storage';

export default function LeftPanel({ subject, currentTopicIdx, onSelectTopic }) {
    const [syllabusOpen, setSyllabusOpen] = useState(true);
    const [libraryOpen, setLibraryOpen] = useState(false);

    const syllabus = subject?.syllabus || [];
    const progress = useMemo(() => subject ? getSubjectProgress(subject.id) : 0, [subject]);
    const completedCount = useMemo(
        () => syllabus.filter((_, i) => subject && isTopicPassed(subject.id, i)).length,
        [subject, syllabus]
    );

    return (
        <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            background: 'var(--bg-card)', overflowY: 'auto',
        }}>
            {/* Subject Header with Progress */}
            <div style={{
                padding: '20px 18px 16px', borderBottom: '1px solid var(--border-color)',
                background: 'linear-gradient(180deg, rgba(99,102,241,0.03) 0%, transparent 100%)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: 'rgba(99,102,241,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <BookOpen size={16} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h2 style={{
                        fontSize: '0.875rem', fontWeight: 700,
                        color: 'var(--text-primary)', lineHeight: 1.3,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>{subject?.name || 'Subject'}</h2>
                </div>

                {/* Mini Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 4, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', borderRadius: 4,
                            background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end))',
                            width: `${progress}%`, transition: 'width 0.6s ease',
                        }} />
                    </div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                        {completedCount}/{syllabus.length}
                    </span>
                </div>
            </div>

            {/* Syllabus */}
            <div style={{ flex: 1 }}>
                <button
                    onClick={() => setSyllabusOpen(!syllabusOpen)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '14px 18px', background: 'transparent', border: 'none',
                        cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 700,
                        color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}
                >
                    {syllabusOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    Topics
                    <span style={{
                        marginLeft: 'auto', fontSize: '0.625rem',
                        background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 10,
                    }}>{syllabus.length}</span>
                </button>

                {syllabusOpen && (
                    <div style={{ padding: '0 10px 16px' }}>
                        {syllabus.map((topic, idx) => {
                            const passed = isTopicPassed(subject?.id, idx);
                            const isCurrent = idx === currentTopicIdx;
                            const isLocked = idx > currentTopicIdx && !passed;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => !isLocked && onSelectTopic(idx)}
                                    disabled={isLocked}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                                        padding: '10px 12px', textAlign: 'left',
                                        background: isCurrent ? 'rgba(99,102,241,0.08)' : 'transparent',
                                        border: isCurrent ? '1px solid rgba(99,102,241,0.15)' : '1px solid transparent',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: isLocked ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        opacity: isLocked ? 0.4 : 1,
                                        marginBottom: 2,
                                    }}
                                >
                                    {passed ? (
                                        <div style={{
                                            width: 22, height: 22, borderRadius: '50%',
                                            background: 'rgba(16,185,129,0.12)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                                        </div>
                                    ) : isLocked ? (
                                        <div style={{
                                            width: 22, height: 22, borderRadius: '50%',
                                            background: 'var(--bg-secondary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <Lock size={11} style={{ color: 'var(--text-muted)' }} />
                                        </div>
                                    ) : (
                                        <div style={{
                                            width: 22, height: 22, borderRadius: '50%',
                                            background: isCurrent ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <span style={{
                                                fontSize: '0.625rem', fontWeight: 700,
                                                color: isCurrent ? 'var(--accent)' : 'var(--text-muted)',
                                            }}>{idx + 1}</span>
                                        </div>
                                    )}
                                    <span style={{
                                        fontSize: '0.8125rem',
                                        fontWeight: isCurrent ? 600 : 400,
                                        color: isCurrent ? 'var(--accent)' : passed ? '#10b981' : 'var(--text-primary)',
                                        lineHeight: 1.3,
                                        overflow: 'hidden', textOverflow: 'ellipsis',
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                    }}>{topic.title}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Library */}
                <button
                    onClick={() => setLibraryOpen(!libraryOpen)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '14px 18px', background: 'transparent', border: 'none',
                        cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 700,
                        color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em',
                        borderTop: '1px solid var(--border-color)',
                    }}
                >
                    {libraryOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    Library
                </button>

                {libraryOpen && (
                    <div style={{ padding: '4px 18px 16px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
                            color: 'var(--text-muted)', fontSize: '0.8125rem',
                        }}>
                            <FileText size={14} /> PDFs
                            <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 10 }}>
                                {subject?.library?.pdfs?.length || 0}
                            </span>
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
                            color: 'var(--text-muted)', fontSize: '0.8125rem',
                        }}>
                            <ImageIcon size={14} /> Infographics
                            <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 10 }}>
                                {subject?.library?.infographics?.length || 0}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
