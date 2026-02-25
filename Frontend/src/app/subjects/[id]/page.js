'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, Play, BookOpen, Clock, CheckCircle2, Circle, Lock,
    BarChart3, Flame, Calendar, Target, Sparkles, Trophy
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
    getSubject, getSubjectProgress, getCurrentTopicIndex,
    isTopicPassed
} from '@/lib/storage';

export default function SubjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [subject, setSubject] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = params?.id;
        if (!id) return;
        const s = getSubject(id);
        if (!s) { router.push('/dashboard'); return; }
        setSubject(s);
        setMounted(true);
    }, [params?.id, router]);

    const progress = useMemo(() => subject ? getSubjectProgress(subject.id) : 0, [subject]);
    const currentIdx = useMemo(() => subject ? getCurrentTopicIndex(subject.id) : 0, [subject]);
    const syllabus = subject?.syllabus || [];
    const completedCount = useMemo(
        () => syllabus.filter((_, i) => subject && isTopicPassed(subject.id, i)).length,
        [subject, syllabus]
    );
    const remainingCount = syllabus.length - completedCount;

    // Calculate days left based on createdAt + duration
    const daysLeft = useMemo(() => {
        if (!subject?.createdAt || !subject?.duration) return null;
        const endDate = new Date(subject.createdAt + subject.duration * 7 * 24 * 60 * 60 * 1000);
        const now = new Date();
        const diff = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
        return diff;
    }, [subject]);

    const accentColors = [
        ['#6366f1', '#8b5cf6'],
        ['#ec4899', '#f43f5e'],
        ['#10b981', '#14b8a6'],
        ['#f59e0b', '#f97316'],
        ['#06b6d4', '#3b82f6'],
        ['#8b5cf6', '#a855f7'],
    ];
    const colors = subject
        ? accentColors[Math.abs(subject.id?.charCodeAt(0) || 0) % accentColors.length]
        : accentColors[0];

    if (!mounted || !subject) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />

            <main style={{ maxWidth: 880, margin: '0 auto', padding: '24px 24px 80px' }}>
                {/* Back Button */}
                <button
                    className="btn-ghost"
                    onClick={() => router.push('/dashboard')}
                    style={{ marginBottom: 24, padding: '8px 12px' }}
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                {/* Hero Header */}
                <div className="animate-fade-in" style={{
                    background: `linear-gradient(135deg, ${colors[0]}18, ${colors[1]}10)`,
                    borderRadius: 'var(--radius-xl)',
                    border: `1px solid ${colors[0]}25`,
                    padding: '40px 36px',
                    marginBottom: 28,
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background decoration */}
                    <div style={{
                        position: 'absolute',
                        top: -60,
                        right: -40,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${colors[0]}12 0%, transparent 70%)`,
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: -30,
                        left: -20,
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${colors[1]}10 0%, transparent 70%)`,
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Level Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '5px 14px',
                            borderRadius: 20,
                            background: `${colors[0]}18`,
                            border: `1px solid ${colors[0]}30`,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: colors[0],
                            marginBottom: 16,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                        }}>
                            <Target size={12} />
                            {subject.level || 'Beginner'}
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            marginBottom: 8,
                            lineHeight: 1.2,
                        }}>{subject.name}</h1>

                        {subject.need && (
                            <p style={{
                                fontSize: '0.9375rem',
                                color: 'var(--text-secondary)',
                                marginBottom: 20,
                                maxWidth: 560,
                                lineHeight: 1.5,
                            }}>{subject.need}</p>
                        )}

                        {/* Progress Ring + Info */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 20,
                            marginBottom: 24,
                        }}>
                            {/* Circular Progress */}
                            <div style={{ position: 'relative', width: 72, height: 72 }}>
                                <svg width={72} height={72} viewBox="0 0 72 72">
                                    <circle cx={36} cy={36} r={30} fill="none" stroke="var(--border-color)" strokeWidth={5} />
                                    <circle
                                        cx={36} cy={36} r={30}
                                        fill="none"
                                        stroke={colors[0]}
                                        strokeWidth={5}
                                        strokeLinecap="round"
                                        strokeDasharray={`${(progress / 100) * 188.5} 188.5`}
                                        transform="rotate(-90 36 36)"
                                        style={{ transition: 'stroke-dasharray 0.6s ease' }}
                                    />
                                </svg>
                                <span style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    color: colors[0],
                                }}>{progress}%</span>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '0.8125rem',
                                    color: 'var(--text-secondary)',
                                    marginBottom: 4,
                                }}>
                                    {completedCount} of {syllabus.length} topics completed
                                </div>
                                <div className="progress-bar" style={{ height: 8, borderRadius: 6 }}>
                                    <div className="progress-fill" style={{
                                        width: `${progress}%`,
                                        background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
                                        borderRadius: 6,
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* Start Learning CTA */}
                        <button
                            className="btn-primary"
                            onClick={() => router.push(`/subjects/${subject.id}/playground`)}
                            style={{
                                padding: '14px 36px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                                borderRadius: 'var(--radius-md)',
                            }}
                        >
                            <Play size={20} />
                            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="animate-slide-up" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 16,
                    marginBottom: 28,
                }}>
                    {[
                        {
                            icon: CheckCircle2, color: '#10b981',
                            label: 'Completed',
                            value: `${completedCount} topics`,
                        },
                        {
                            icon: BookOpen, color: '#6366f1',
                            label: 'Remaining',
                            value: `${remainingCount} topics`,
                        },
                        {
                            icon: Clock, color: '#f59e0b',
                            label: 'Duration',
                            value: `${subject.duration || 4} weeks`,
                        },
                        {
                            icon: Calendar, color: '#ec4899',
                            label: 'Days Left',
                            value: daysLeft !== null ? `${daysLeft} days` : '—',
                        },
                    ].map((stat, i) => (
                        <div key={i} className="card" style={{
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                        }}>
                            <div style={{
                                width: 42, height: 42, borderRadius: 12,
                                background: `${stat.color}12`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <stat.icon size={20} style={{ color: stat.color }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>
                                    {stat.label}
                                </div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {stat.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Topics Breakdown */}
                <div className="card animate-slide-up" style={{ padding: '28px', overflow: 'visible' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 24,
                    }}>
                        <h2 style={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}>
                            <Sparkles size={20} style={{ color: colors[0] }} />
                            Syllabus
                        </h2>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            background: 'var(--bg-secondary)',
                            padding: '4px 12px',
                            borderRadius: 20,
                        }}>
                            {syllabus.length} topics
                        </span>
                    </div>

                    <div style={{ display: 'grid', gap: 6 }}>
                        {syllabus.map((topic, idx) => {
                            const passed = isTopicPassed(subject.id, idx);
                            const isCurrent = idx === currentIdx;
                            const isLocked = idx > currentIdx && !passed;

                            return (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 14,
                                        padding: '14px 18px',
                                        borderRadius: 'var(--radius-md)',
                                        background: isCurrent
                                            ? `${colors[0]}08`
                                            : passed
                                                ? 'rgba(16,185,129,0.04)'
                                                : 'transparent',
                                        border: isCurrent
                                            ? `1px solid ${colors[0]}25`
                                            : '1px solid transparent',
                                        opacity: isLocked ? 0.45 : 1,
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {/* Status Icon */}
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: passed
                                            ? 'rgba(16,185,129,0.12)'
                                            : isCurrent
                                                ? `${colors[0]}15`
                                                : 'var(--bg-secondary)',
                                        flexShrink: 0,
                                    }}>
                                        {passed ? (
                                            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                                        ) : isLocked ? (
                                            <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                                        ) : (
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                color: isCurrent ? colors[0] : 'var(--text-muted)',
                                            }}>{idx + 1}</span>
                                        )}
                                    </div>

                                    {/* Topic Title */}
                                    <div style={{ flex: 1 }}>
                                        <span style={{
                                            fontSize: '0.9375rem',
                                            fontWeight: isCurrent ? 600 : 400,
                                            color: passed
                                                ? '#10b981'
                                                : isCurrent
                                                    ? colors[0]
                                                    : 'var(--text-primary)',
                                        }}>{topic.title}</span>
                                    </div>

                                    {/* Status Badge */}
                                    {passed && (
                                        <span style={{
                                            fontSize: '0.6875rem',
                                            fontWeight: 600,
                                            color: '#10b981',
                                            background: 'rgba(16,185,129,0.08)',
                                            padding: '3px 10px',
                                            borderRadius: 12,
                                        }}>Completed</span>
                                    )}
                                    {isCurrent && !passed && (
                                        <span style={{
                                            fontSize: '0.6875rem',
                                            fontWeight: 600,
                                            color: colors[0],
                                            background: `${colors[0]}10`,
                                            padding: '3px 10px',
                                            borderRadius: 12,
                                        }}>Current</span>
                                    )}
                                    {isLocked && (
                                        <span style={{
                                            fontSize: '0.6875rem',
                                            color: 'var(--text-muted)',
                                        }}>Locked</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Completion Banner */}
                {progress === 100 && (
                    <div className="animate-fade-in" style={{
                        textAlign: 'center',
                        padding: '32px',
                        marginTop: 28,
                        borderRadius: 'var(--radius-xl)',
                        background: `linear-gradient(135deg, ${colors[0]}10, ${colors[1]}10)`,
                        border: `1px solid ${colors[0]}25`,
                    }}>
                        <Trophy size={40} style={{ color: '#f59e0b', margin: '0 auto 12px' }} />
                        <h3 style={{
                            fontSize: '1.25rem', fontWeight: 700, marginBottom: 4,
                            color: 'var(--text-primary)',
                        }}>Subject Complete! 🎉</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            You&apos;ve mastered all {syllabus.length} topics. Great job!
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
