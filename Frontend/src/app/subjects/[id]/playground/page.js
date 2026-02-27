'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, PanelLeftClose, PanelRightClose, ChevronRight, BookOpen, Languages, ChevronDown, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];
import LeftPanel from '@/components/playground/LeftPanel';
import CenterPanel from '@/components/playground/CenterPanel';
import RightPanel from '@/components/playground/RightPanel';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/utils/api';

export default function PlaygroundPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [subject, setSubject] = useState(null);
    const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
    const [activeMode, setActiveMode] = useState('explain');
    const [mounted, setMounted] = useState(false);
    const [language, setLanguage] = useState('en');
    const [showLangDropdown, setShowLangDropdown] = useState(false);

    // Panel widths (percentages)
    const [leftWidth, setLeftWidth] = useState(20);
    const [rightWidth, setRightWidth] = useState(28);
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);

    // Mobile state
    const [isMobile, setIsMobile] = useState(false);
    const [mobilePanel, setMobilePanel] = useState('center');

    const containerRef = useRef(null);
    const isDragging = useRef(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        const id = params?.id;
        if (!id || !user) return;

        const fetchSubject = async () => {
            try {
                const data = await apiFetch(`/api/subjects/${id}`);
                if (!data) { router.push('/dashboard'); return; }
                setSubject(data);

                // Find first non-passed topic
                const topics = data.topics || [];
                const firstIncompleteIdx = topics.findIndex(t => !t.passed);
                setCurrentTopicIdx(firstIncompleteIdx === -1 ? Math.max(0, topics.length - 1) : firstIncompleteIdx);

                setMounted(true);
            } catch (error) {
                console.error('Failed to fetch subject:', error);
                router.push('/dashboard');
            }
        };
        fetchSubject();
    }, [params?.id, user, authLoading, router]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseDown = useCallback((side) => (e) => {
        e.preventDefault();
        isDragging.current = side;
        const handleMouseMove = (e) => {
            if (!containerRef.current || !isDragging.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const totalWidth = rect.width;
            const pct = (x / totalWidth) * 100;
            if (isDragging.current === 'left') setLeftWidth(Math.max(12, Math.min(35, pct)));
            else if (isDragging.current === 'right') setRightWidth(Math.max(15, Math.min(45, 100 - pct)));
        };
        const handleMouseUp = () => {
            isDragging.current = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    const handleQuizPass = useCallback(async (topicIdx) => {
        if (!subject) return;
        const topics = subject.topics || [];
        const topic = topics[topicIdx];
        if (!topic) return;

        try {
            // Mark topic as passed on backend
            await apiFetch(`/api/topics/${topic.id}/pass`, { method: 'POST' });
            // Record streak activity
            await apiFetch('/api/user/streak', { method: 'POST' }).catch(() => {});
            // Update local state
            setSubject(prev => {
                if (!prev) return prev;
                const newTopics = prev.topics.map((t, i) =>
                    i === topicIdx ? { ...t, passed: true, passed_at: new Date().toISOString() } : t
                );
                return { ...prev, topics: newTopics };
            });
        } catch (err) {
            console.error('Failed to mark topic passed:', err);
            // Still update local state as fallback
            setSubject(prev => {
                if (!prev) return prev;
                const newTopics = prev.topics.map((t, i) =>
                    i === topicIdx ? { ...t, passed: true, passed_at: new Date().toISOString() } : t
                );
                return { ...prev, topics: newTopics };
            });
        }
    }, [subject]);

    const handleSelectTopic = useCallback((idx) => {
        setCurrentTopicIdx(idx);
        setActiveMode('explain');
    }, []);

    if (!mounted || !subject) return null;

    const currentTopic = subject.topics?.[currentTopicIdx]?.title || 'Getting Started';
    const progress = Math.round(((subject.topics || []).filter(t => t.passed).length / (subject.topics?.length || 1)) * 100);

    // ─── Mobile Layout ─────────────────
    if (isMobile) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
                <Navbar />
                {/* Mobile Tab Switcher */}
                <div style={{
                    display: 'flex', borderBottom: '1px solid var(--border-color)',
                    background: 'var(--bg-card)', padding: '0 4px',
                }}>
                    {[
                        { key: 'left', label: '📖 Syllabus' },
                        { key: 'center', label: '🎓 Learn' },
                        { key: 'right', label: '💬 Chat' },
                    ].map(p => (
                        <button key={p.key} onClick={() => setMobilePanel(p.key)}
                            style={{
                                flex: 1, padding: '12px 8px', border: 'none', cursor: 'pointer',
                                fontSize: '0.8125rem', fontWeight: 600,
                                background: 'transparent',
                                color: mobilePanel === p.key ? 'var(--accent)' : 'var(--text-muted)',
                                borderBottom: mobilePanel === p.key ? '2px solid var(--accent)' : '2px solid transparent',
                                transition: 'all 0.2s',
                            }}
                        >{p.label}</button>
                    ))}
                </div>
                <div style={{ height: 'calc(100vh - 64px - 48px)' }}>
                    {mobilePanel === 'left' && <LeftPanel subject={subject} currentTopicIdx={currentTopicIdx} onSelectTopic={handleSelectTopic} />}
                    {mobilePanel === 'center' && <CenterPanel subject={subject} currentTopicIdx={currentTopicIdx} activeMode={activeMode} setActiveMode={setActiveMode} onQuizPass={handleQuizPass} />}
                    {mobilePanel === 'right' && <RightPanel subject={subject} currentTopic={currentTopic} activeMode={activeMode} />}
                </div>
            </div>
        );
    }

    // ─── Desktop Layout ─────────────────
    const effectiveLeft = leftCollapsed ? 0 : leftWidth;
    const effectiveRight = rightCollapsed ? 0 : rightWidth;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />

            {/* Topic Bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0 16px',
                height: 52,
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-color)',
                flexShrink: 0,
            }}>
                {/* Back */}
                <button className="btn-ghost" onClick={() => router.push(`/subjects/${subject.id}`)}
                    style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
                    <ArrowLeft size={16} />
                </button>

                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                    <div style={{
                        width: 24, height: 24, borderRadius: 6,
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        <BookOpen size={11} style={{ color: 'var(--accent)' }} />
                    </div>
                    <span style={{
                        fontSize: '0.8125rem', color: 'var(--text-muted)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: 120,
                    }}>{subject.name}</span>
                    <ChevronRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0, opacity: 0.4 }} />
                    <span style={{
                        fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{currentTopic}</span>
                </div>

                {/* Right side controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

                    {/* Progress pill */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '5px 12px 5px 10px',
                        borderRadius: 20,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                    }}>
                        <div style={{ width: 64, height: 5, borderRadius: 4, background: 'rgba(99,102,241,0.12)', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: 4,
                                background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end))',
                                width: `${progress}%`, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                            }} />
                        </div>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent)', minWidth: 28, textAlign: 'right' }}>{progress}%</span>
                    </div>

                    {/* Language Selector */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowLangDropdown(!showLangDropdown)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '5px 10px', borderRadius: 20,
                                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                                cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500,
                                color: 'var(--text-secondary)', transition: 'all 0.2s',
                            }}
                        >
                            <Languages size={13} style={{ color: 'var(--accent)' }} />
                            <span>{LANGUAGES.find(l => l.code === language)?.flag}</span>
                            <span style={{ maxWidth: 56, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {LANGUAGES.find(l => l.code === language)?.name}
                            </span>
                            <ChevronDown size={11} style={{ opacity: 0.5 }} />
                        </button>

                        {showLangDropdown && (
                            <>
                                <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setShowLangDropdown(false)} />
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 99,
                                    background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                                    overflow: 'hidden', width: 180,
                                    animation: 'fadeIn 0.15s ease-out',
                                }}>
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => { setLanguage(lang.code); setShowLangDropdown(false); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                                                padding: '9px 14px', border: 'none', cursor: 'pointer',
                                                background: language === lang.code ? 'rgba(99,102,241,0.08)' : 'transparent',
                                                color: language === lang.code ? 'var(--accent)' : 'var(--text-primary)',
                                                fontSize: '0.8125rem', fontWeight: language === lang.code ? 600 : 400,
                                                transition: 'background 0.15s',
                                            }}
                                        >
                                            <span style={{ fontSize: '1rem' }}>{lang.flag}</span>
                                            {lang.name}
                                            {language === lang.code && <CheckCircle2 size={13} style={{ marginLeft: 'auto', color: 'var(--accent)' }} />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ width: 1, height: 22, background: 'var(--border-color)' }} />

                    {/* Panel toggles */}
                    <button className="btn-ghost" onClick={() => setLeftCollapsed(!leftCollapsed)}
                        style={{ padding: '6px 7px', color: leftCollapsed ? 'var(--text-muted)' : 'var(--accent)' }}
                        title={leftCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}>
                        <PanelLeftClose size={15} />
                    </button>
                    <button className="btn-ghost" onClick={() => setRightCollapsed(!rightCollapsed)}
                        style={{ padding: '6px 7px', color: rightCollapsed ? 'var(--text-muted)' : 'var(--accent)' }}
                        title={rightCollapsed ? 'Show Chat' : 'Hide Chat'}>
                        <PanelRightClose size={15} />
                    </button>
                </div>
            </div>

            {/* 3-Pane Layout */}
            <div ref={containerRef} style={{
                display: 'flex', height: 'calc(100vh - 64px - 52px)', overflow: 'hidden',
            }}>
                {/* Left */}
                {!leftCollapsed && (
                    <>
                        <div style={{
                            width: `${effectiveLeft}%`, flexShrink: 0,
                            overflow: 'hidden', borderRight: '1px solid var(--border-color)',
                        }}>
                            <LeftPanel subject={subject} currentTopicIdx={currentTopicIdx} onSelectTopic={handleSelectTopic} />
                        </div>
                        <div className="resize-handle" onMouseDown={handleMouseDown('left')} />
                    </>
                )}

                {/* Center */}
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <CenterPanel subject={subject} currentTopicIdx={currentTopicIdx}
                        activeMode={activeMode} setActiveMode={setActiveMode} onQuizPass={handleQuizPass}
                        language={language} />
                </div>

                {/* Right */}
                {!rightCollapsed && (
                    <>
                        <div className="resize-handle" onMouseDown={handleMouseDown('right')} />
                        <div style={{
                            width: `${effectiveRight}%`, flexShrink: 0,
                            overflow: 'hidden', borderLeft: '1px solid var(--border-color)',
                        }}>
                            <RightPanel subject={subject} currentTopic={currentTopic} activeMode={activeMode} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
