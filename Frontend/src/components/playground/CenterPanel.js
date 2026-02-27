'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    BookOpen, Eye, Hand, ClipboardCheck, Globe2,
    ChevronRight, CheckCircle2, XCircle, Award,
    RotateCcw, Languages
} from 'lucide-react';

const MODES = [
    { key: 'explain', icon: BookOpen, label: 'Explain', color: '#6366f1' },
    { key: 'demonstrate', icon: Eye, label: 'Demonstrate', color: '#8b5cf6' },
    { key: 'try', icon: Hand, label: 'Let me try', color: '#10b981' },
    { key: 'test', icon: ClipboardCheck, label: 'Test me', color: '#f59e0b' },
    { key: 'apply', icon: Globe2, label: 'Apply', color: '#ec4899' },
];

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];

// Simulated translation map
const TRANSLATIONS = {
    en: {},
    ta: { 'Key Concepts': 'முக்கிய கருத்துகள்', 'Detailed Explanation': 'விரிவான விளக்கம்', 'Foundation': 'அடித்தளம்', 'Practical Understanding': 'நடைமுறை புரிதல்', 'Common Patterns': 'பொதுவான வடிவங்கள்', 'Pro Tip': 'நிபுணர் குறிப்பு' },
    hi: { 'Key Concepts': 'मुख्य अवधारणाएं', 'Detailed Explanation': 'विस्तृत व्याख्या', 'Foundation': 'आधार', 'Practical Understanding': 'व्यावहारिक समझ', 'Common Patterns': 'सामान्य पैटर्न', 'Pro Tip': 'प्रो टिप' },
    kn: { 'Key Concepts': 'ಪ್ರಮುಖ ಪರಿಕಲ್ಪನೆಗಳು', 'Detailed Explanation': 'ವಿವರವಾದ ವಿವರಣೆ', 'Foundation': 'ಅಡಿಪಾಯ', 'Practical Understanding': 'ಪ್ರಾಯೋಗಿಕ ತಿಳುವಳಿಕೆ', 'Common Patterns': 'ಸಾಮಾನ್ಯ ಮಾದರಿಗಳು', 'Pro Tip': 'ತಜ್ಞ ಸಲಹೆ' },
    te: { 'Key Concepts': 'కీలక భావనలు', 'Detailed Explanation': 'వివరణాత్మక వివరణ', 'Foundation': 'పునాది', 'Practical Understanding': 'ఆచరణాత్మక అవగాహన', 'Common Patterns': 'సాధారణ నమూనాలు', 'Pro Tip': 'నిపుణుల చిట్కా' },
};

const SAMPLE_CONTENT = {
    explain: (topic) => `# ${topic}\n\nThis topic covers the fundamental concepts and principles behind **${topic}**. Understanding these foundations is crucial for building more complex skills.\n\n## Key Concepts\n\n- **Core Definition**: ${topic} refers to the systematic approach of organizing and understanding the underlying patterns.\n- **Why It Matters**: Mastering this gives you a strong foundation for everything that follows.\n- **Prerequisites**: Basic familiarity with the subject area.\n\n## Detailed Explanation\n\nLet's break this down into digestible pieces...\n\n### Foundation\nEvery concept in this area builds upon understanding the basic building blocks. Think of it like constructing a house — you need a solid foundation before adding walls and a roof.\n\n### Practical Understanding\nThe best way to grasp ${topic} is through combining theory with hands-on practice. Start with understanding the "why" before moving to the "how".\n\n### Common Patterns\nAs you study this topic, you'll notice recurring patterns that apply across many scenarios. Recognizing these patterns will accelerate your learning significantly.\n\n> 💡 **Pro Tip**: Take notes as you go — the connections between concepts become clearer over time.`,

    demonstrate: (topic) => `# ${topic} — Demonstration\n\nLet's work through a practical example of **${topic}** step by step.\n\n## Example Walkthrough\n\n### Step 1: Setup\nFirst, we establish our starting point and define what we're working with.\n\n\`\`\`\n// Setting up our workspace\ninitialize()\nconfigure("${topic.toLowerCase().replace(/\s/g, '_')}")\n\`\`\`\n\n### Step 2: Implementation\nNow let's implement the core concept:\n\n\`\`\`\n// Core implementation\nfunction demonstrate${topic.replace(/\s/g, '')}() {\n  const concept = new Concept("${topic}");\n  concept.apply();\n  return concept.getResult();\n}\n\`\`\`\n\n### Step 3: Observe the Result\nAfter running this, you would see the concept in action, demonstrating how **${topic}** works in practice.\n\n### Key Takeaways\n- Notice how we structured the approach\n- The pattern follows: Setup → Apply → Verify\n- This same pattern applies to many similar problems`,

    try: (topic) => `# Practice: ${topic}\n\nNow it's your turn! Try solving these exercises related to **${topic}**.\n\n## Exercise 1: Basic Application\nApply what you've learned about ${topic} to solve the following:\n\n> Given the concepts covered, can you identify the three key components and explain each?\n\nTry writing your answer in the chat panel →\n\n## Exercise 2: Problem Solving\nHere's a scenario:\n\nYou're tasked with implementing ${topic} in a real project. What would your approach be?\n\n1. Outline your strategy\n2. Identify potential challenges\n3. Propose solutions for each challenge\n\n## Exercise 3: Critical Thinking\nCompare and contrast different approaches to ${topic}. What are the trade-offs?\n\n> 🎯 **Goal**: Complete at least 2 out of 3 exercises before moving on.`,

    apply: (topic) => `# Real-World Application: ${topic}\n\n## Industry Use Cases\n\n### 🏢 Enterprise\nLarge organizations use ${topic} to streamline their workflows. For example, a Fortune 500 company recently implemented these concepts to reduce processing time by 40%.\n\n### 🚀 Startups\nStartups leverage ${topic} to build scalable solutions from day one. The lean approach means focusing on the core principles without over-engineering.\n\n### 📱 Consumer Products\nEveryday products you use rely on ${topic} behind the scenes. From social media algorithms to e-commerce recommendations, these principles are everywhere.\n\n## How to Apply This\n\n1. **Identify Opportunities**: Look for areas in your work or projects where ${topic} applies\n2. **Start Small**: Begin with a pilot project\n3. **Iterate**: Refine your approach based on results\n4. **Scale**: Once proven, expand to larger applications\n\n## Challenge\n\nThink of one area in your daily life where you could apply the concepts from ${topic}. Share your idea in the chat!`,
};

function generateQuiz(topic) {
    return [
        { question: `What is the primary purpose of ${topic}?`, options: ['To provide a systematic approach to understanding core concepts', 'To replace all existing methods entirely', 'To make the subject more complex', 'None of the above'], correct: 0 },
        { question: `Which of the following is a key component of ${topic}?`, options: ['Random experimentation without goals', 'Foundational understanding and structured learning', 'Memorizing without comprehension', 'Skipping prerequisites'], correct: 1 },
        { question: `What is the recommended approach when first learning ${topic}?`, options: ['Jump to the most advanced material', 'Ignore the theory completely', 'Build a solid foundation, then progress gradually', 'Only read about it but never practice'], correct: 2 },
        { question: `In real-world applications of ${topic}, what typically comes first?`, options: ['Scaling to production immediately', 'Identifying opportunities and starting small', 'Complete overhaul of existing systems', 'Hiring a full team before understanding the concept'], correct: 1 },
        { question: `Which best describes the relationship between ${topic} and practical skills?`, options: ['Theory and practice are completely separate', 'Only theory matters, practice is optional', 'They are complementary — understanding both leads to mastery', 'Practice alone is sufficient'], correct: 2 },
        { question: `What common mistake should learners avoid with ${topic}?`, options: ['Taking notes regularly', 'Practicing with real examples', 'Skipping foundational concepts', 'Asking questions when confused'], correct: 2 },
        { question: `How does ${topic} benefit from iterative practice?`, options: ["It doesn't — one attempt is enough", 'Repetition builds and reinforces understanding over time', 'Only the first attempt matters', 'Iteration reduces understanding'], correct: 1 },
        { question: `What pattern does ${topic} commonly follow?`, options: ['Setup → Apply → Verify', 'Guess → Check → Abandon', 'Start → Stop → Restart', 'No particular pattern'], correct: 0 },
        { question: `Which industry does NOT typically benefit from ${topic}?`, options: ['Enterprise', 'Startups', 'Consumer Products', 'All industries can benefit from it'], correct: 3 },
        { question: `What is the final step in mastering ${topic}?`, options: ['Memorizing all definitions', 'Teaching others and applying knowledge in varied contexts', 'Passing a single test', 'Reading one textbook'], correct: 1 },
    ];
}

export default function CenterPanel({ subject, currentTopicIdx, activeMode, setActiveMode, onQuizPass, language = 'en' }) {
    const [quizState, setQuizState] = useState(null);
    const [focusWarning, setFocusWarning] = useState(false);

    const topic = subject?.topics?.[currentTopicIdx]?.title || 'Getting Started';

    // Focus mode — detect tab switch
    useEffect(() => {
        if (activeMode !== 'test' || !quizState || quizState.finished) return;
        const handleVisibility = () => {
            if (document.hidden) {
                setFocusWarning(true);
                setTimeout(() => setFocusWarning(false), 4000);
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [activeMode, quizState]);

    const startQuiz = useCallback(() => {
        setQuizState({ questions: generateQuiz(topic), currentQ: 0, answers: [], selectedAnswer: null, showResult: false, finished: false, score: 0 });
    }, [topic]);

    const selectAnswer = (idx) => {
        if (quizState?.showResult) return;
        setQuizState(prev => ({ ...prev, selectedAnswer: idx }));
    };

    const submitAnswer = () => {
        const q = quizState.questions[quizState.currentQ];
        const isCorrect = quizState.selectedAnswer === q.correct;
        const newAnswers = [...quizState.answers, { questionIdx: quizState.currentQ, selected: quizState.selectedAnswer, correct: q.correct, isCorrect }];
        setQuizState(prev => ({ ...prev, answers: newAnswers, showResult: true, score: prev.score + (isCorrect ? 1 : 0) }));
    };

    const nextQuestion = () => {
        if (quizState.currentQ >= quizState.questions.length - 1) {
            const passed = quizState.score >= 7;
            setQuizState(prev => ({ ...prev, finished: true }));
            if (passed) onQuizPass(currentTopicIdx);
        } else {
            setQuizState(prev => ({ ...prev, currentQ: prev.currentQ + 1, selectedAnswer: null, showResult: false }));
        }
    };

    const translateText = (text) => {
        if (language === 'en') return text;
        const dict = TRANSLATIONS[language] || {};
        let result = text;
        Object.keys(dict).forEach(key => {
            result = result.replace(new RegExp(key, 'g'), dict[key]);
        });
        return result;
    };

    const renderMarkdown = (text) => {
        const translated = translateText(text);
        const lines = translated.split('\n');
        return lines.map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16, marginTop: i > 0 ? 32 : 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>{line.slice(2)}</h1>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 10, marginTop: 28, color: 'var(--text-primary)', paddingBottom: 8, borderBottom: '1px solid var(--border-color)' }}>{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8, marginTop: 20, color: 'var(--accent)' }}>{line.slice(4)}</h3>;
            if (line.startsWith('> ')) return (
                <div key={i} style={{ borderLeft: '4px solid var(--accent)', padding: '14px 20px', background: 'rgba(99,102,241,0.04)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', margin: '16px 0', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{renderInline(line.slice(2))}</div>
            );
            if (line.startsWith('```')) return null;
            if (line.startsWith('- ')) return (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.3 }}>•</span>
                    <span>{renderInline(line.slice(2))}</span>
                </div>
            );
            if (line.match(/^\d+\.\s/)) {
                const num = line.match(/^(\d+)\./)[1];
                return (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '6px 0', fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 700, minWidth: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', fontSize: '0.75rem', flexShrink: 0 }}>{num}</span>
                        <span>{renderInline(line.replace(/^\d+\.\s/, ''))}</span>
                    </div>
                );
            }
            if (line.trim() === '') return <div key={i} style={{ height: 12 }} />;
            return <p key={i} style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--text-primary)', margin: '4px 0' }}>{renderInline(line)}</p>;
        });
    };

    const renderInline = (text) => {
        const parts = text.split(/(\*\*.*?\*\*|`.*?`|💡|🎯|🏢|🚀|📱)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
            if (part.startsWith('`') && part.endsWith('`')) return <code key={i} style={{ background: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: 6, fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>{part.slice(1, -1)}</code>;
            return part;
        });
    };

    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative' }}>
            {/* Focus Warning Toast */}
            {focusWarning && (
                <div style={{
                    position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
                    padding: '14px 28px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(245,158,11,0.95), rgba(249,115,22,0.95))',
                    color: 'white', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(245,158,11,0.4)',
                    animation: 'slideUp 0.3s ease-out',
                }}>
                    <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Focus Mode Active</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Stay on this tab during the quiz!</div>
                    </div>
                </div>
            )}

            {/* Mode Tabs */}
            <div style={{
                display: 'flex', alignItems: 'center',
                padding: '6px 12px',
                borderBottom: '1px solid var(--border-color)', flexShrink: 0,
                background: 'var(--bg-card)',
                gap: 2,
            }}>
                {MODES.map(mode => {
                    const isActive = activeMode === mode.key;
                    return (
                        <button
                            key={mode.key}
                            onClick={() => { setActiveMode(mode.key); if (mode.key !== 'test') setQuizState(null); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '7px 14px', borderRadius: 8,
                                fontSize: '0.8125rem', fontWeight: isActive ? 700 : 500,
                                border: 'none',
                                cursor: 'pointer', whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                                background: isActive ? `${mode.color}15` : 'transparent',
                                color: isActive ? mode.color : 'var(--text-muted)',
                                position: 'relative',
                            }}
                        >
                            <mode.icon size={14} />
                            {mode.label}
                            {isActive && (
                                <span style={{
                                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                                    width: 20, height: 2.5, borderRadius: 2,
                                    background: mode.color,
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                {activeMode === 'test' ? (
                    /* ========== QUIZ INTERFACE ========== */
                    !quizState ? (
                        /* Quiz Start Screen */
                        <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: 48 }}>
                            <div style={{
                                width: 100, height: 100, borderRadius: 28, margin: '0 auto 24px',
                                background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.08))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(245,158,11,0.15)',
                            }}>
                                <ClipboardCheck size={44} style={{ color: '#f59e0b' }} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
                                Quiz Time! 🧠
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: 6, maxWidth: 440, margin: '0 auto 6px' }}>
                                Test your knowledge on <strong style={{ color: 'var(--accent)' }}>{topic}</strong>
                            </p>

                            {/* Quiz Info Cards */}
                            <div style={{
                                display: 'flex', gap: 12, justifyContent: 'center', margin: '24px 0 32px',
                                flexWrap: 'wrap',
                            }}>
                                {[
                                    { label: 'Questions', value: '10', icon: '📝' },
                                    { label: 'Pass Score', value: '7/10', icon: '🎯' },
                                    { label: 'Focus Mode', value: 'ON', icon: '🔒' },
                                ].map((info, i) => (
                                    <div key={i} style={{
                                        padding: '16px 24px', borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        textAlign: 'center', minWidth: 110,
                                    }}>
                                        <div style={{ fontSize: '1.25rem', marginBottom: 6 }}>{info.icon}</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{info.value}</div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>{info.label}</div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={startQuiz}
                                style={{
                                    padding: '14px 40px', fontSize: '1rem', fontWeight: 700, borderRadius: 30,
                                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                    color: 'white', border: 'none', cursor: 'pointer',
                                    boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
                                    transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 10,
                                }}
                            >
                                <ClipboardCheck size={20} />
                                Start Quiz
                            </button>
                        </div>
                    ) : quizState.finished ? (
                        /* Quiz Results */
                        <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: 32 }}>
                            {/* Score Circle */}
                            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 24px' }}>
                                <svg width={120} height={120} viewBox="0 0 120 120">
                                    <circle cx={60} cy={60} r={50} fill="none" stroke="var(--border-color)" strokeWidth={8} />
                                    <circle cx={60} cy={60} r={50} fill="none"
                                        stroke={quizState.score >= 7 ? '#10b981' : '#ef4444'}
                                        strokeWidth={8} strokeLinecap="round"
                                        strokeDasharray={`${(quizState.score / 10) * 314} 314`}
                                        transform="rotate(-90 60 60)"
                                        style={{ transition: 'stroke-dasharray 1s ease' }}
                                    />
                                </svg>
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 800, color: quizState.score >= 7 ? '#10b981' : '#ef4444' }}>
                                        {quizState.score}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>out of 10</span>
                                </div>
                            </div>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6, color: quizState.score >= 7 ? '#10b981' : '#ef4444' }}>
                                {quizState.score >= 7 ? '🎉 Brilliant!' : '💪 Keep Going!'}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
                                {quizState.score >= 7
                                    ? `You've mastered "${topic}"! The next topic is now unlocked.`
                                    : `You need 7/10 to pass. Review the material and try again.`}
                            </p>

                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 36 }}>
                                {quizState.score < 7 && (
                                    <button onClick={startQuiz} style={{
                                        padding: '12px 28px', borderRadius: 30, fontWeight: 600, fontSize: '0.875rem',
                                        background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white',
                                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                                        boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
                                    }}>
                                        <RotateCcw size={16} /> Try Again
                                    </button>
                                )}
                                <button onClick={() => { setActiveMode('explain'); setQuizState(null); }} className="btn-secondary"
                                    style={{ borderRadius: 30, padding: '12px 28px' }}>
                                    Back to Learning
                                </button>
                            </div>

                            {/* Answer Review Grid */}
                            <div style={{ textAlign: 'left', maxWidth: 560, margin: '0 auto' }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Answer Review
                                </h3>
                                <div style={{ display: 'grid', gap: 6 }}>
                                    {quizState.answers.map((a, i) => (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '12px 16px', borderRadius: 'var(--radius-md)',
                                            background: a.isCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                                            border: `1px solid ${a.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                                        }}>
                                            {a.isCorrect ? <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} /> : <XCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />}
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', flex: 1 }}>Q{i + 1}: {quizState.questions[i].question.substring(0, 55)}...</span>
                                            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: a.isCorrect ? '#10b981' : '#ef4444' }}>{a.isCorrect ? 'Correct' : 'Wrong'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Active Quiz Question */
                        <div className="animate-fade-in" key={quizState.currentQ}>
                            {/* Top Bar */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <div style={{
                                    padding: '6px 14px', borderRadius: 20, background: 'rgba(245,158,11,0.1)',
                                    fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b',
                                }}>
                                    Question {quizState.currentQ + 1} / {quizState.questions.length}
                                </div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '6px 14px', borderRadius: 20, background: 'rgba(99,102,241,0.08)',
                                    fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)',
                                }}>
                                    Score: {quizState.score}/{quizState.currentQ + (quizState.showResult ? 1 : 0)}
                                </div>
                            </div>

                            {/* Progress Dots */}
                            <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
                                {quizState.questions.map((_, i) => (
                                    <div key={i} style={{
                                        flex: 1, height: 4, borderRadius: 2,
                                        background: i < quizState.currentQ
                                            ? (quizState.answers[i]?.isCorrect ? '#10b981' : '#ef4444')
                                            : i === quizState.currentQ ? 'var(--accent)' : 'var(--bg-secondary)',
                                        transition: 'all 0.3s',
                                    }} />
                                ))}
                            </div>

                            {/* Question */}
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 28, lineHeight: 1.5 }}>
                                {quizState.questions[quizState.currentQ].question}
                            </h3>

                            {/* Options */}
                            <div style={{ display: 'grid', gap: 10, marginBottom: 28 }}>
                                {quizState.questions[quizState.currentQ].options.map((opt, idx) => {
                                    const isSelected = quizState.selectedAnswer === idx;
                                    const isCorrectAnswer = quizState.questions[quizState.currentQ].correct === idx;
                                    const showingResult = quizState.showResult;

                                    let bg = 'var(--bg-card)';
                                    let border = 'var(--border-color)';
                                    let textColor = 'var(--text-primary)';

                                    if (showingResult && isCorrectAnswer) { bg = 'rgba(16,185,129,0.08)'; border = '#10b981'; }
                                    else if (showingResult && isSelected && !isCorrectAnswer) { bg = 'rgba(239,68,68,0.08)'; border = '#ef4444'; }
                                    else if (isSelected) { bg = 'rgba(99,102,241,0.08)'; border = 'var(--accent)'; }

                                    return (
                                        <button key={idx} onClick={() => selectAnswer(idx)} disabled={showingResult}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 14,
                                                padding: '16px 20px', borderRadius: 'var(--radius-md)',
                                                background: bg, border: `2px solid ${border}`,
                                                cursor: showingResult ? 'default' : 'pointer',
                                                transition: 'all 0.2s', textAlign: 'left',
                                                fontSize: '0.9375rem', color: textColor, width: '100%',
                                            }}
                                        >
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                                fontWeight: 700, fontSize: '0.8125rem',
                                                background: isSelected ? 'var(--accent)' : 'var(--bg-secondary)',
                                                color: isSelected ? 'white' : 'var(--text-muted)',
                                                transition: 'all 0.2s',
                                            }}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span style={{ flex: 1 }}>{opt}</span>
                                            {showingResult && isCorrectAnswer && <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0 }} />}
                                            {showingResult && isSelected && !isCorrectAnswer && <XCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Action Button */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {!quizState.showResult ? (
                                    <button disabled={quizState.selectedAnswer === null} onClick={submitAnswer}
                                        style={{
                                            padding: '12px 32px', borderRadius: 30, fontWeight: 600, fontSize: '0.875rem',
                                            background: quizState.selectedAnswer !== null ? 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' : 'var(--bg-secondary)',
                                            color: quizState.selectedAnswer !== null ? 'white' : 'var(--text-muted)',
                                            border: 'none', cursor: quizState.selectedAnswer !== null ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8,
                                            boxShadow: quizState.selectedAnswer !== null ? '0 4px 16px var(--accent-glow)' : 'none',
                                        }}>
                                        Submit Answer <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <button onClick={nextQuestion}
                                        style={{
                                            padding: '12px 32px', borderRadius: 30, fontWeight: 600, fontSize: '0.875rem',
                                            background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                                            color: 'white', border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            boxShadow: '0 4px 16px var(--accent-glow)',
                                        }}>
                                        {quizState.currentQ >= quizState.questions.length - 1 ? 'See Results' : 'Next Question'}
                                        <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    /* ========== LEARNING CONTENT ========== */
                    <div className="animate-fade-in" key={`${activeMode}-${language}`}>
                        {/* Language indicator */}
                        {language !== 'en' && (
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '6px 14px', borderRadius: 20, marginBottom: 20,
                                background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
                                fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500,
                            }}>
                                <Languages size={12} />
                                Translated to {currentLang.name} {currentLang.flag}
                            </div>
                        )}
                        {renderMarkdown(
                            SAMPLE_CONTENT[activeMode]?.(topic) || `# ${topic}\n\nContent for mode: ${activeMode}`
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
