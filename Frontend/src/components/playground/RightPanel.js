'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Send, MessageSquarePlus, History, X, Pencil, Trash2,
    Image as ImageIcon, Sparkles, Bot
} from 'lucide-react';

function simulateAIResponse(userMsg, topic, mode) {
    const responses = {
        explain: [
            `Great question about **${topic}**! The key thing to understand is that this concept builds upon fundamental principles. Once you grasp the underlying pattern, everything else falls into place.`,
            `Let me break that down. In the context of **${topic}**, you're essentially dealing with a structured approach that follows the pattern: define → implement → verify.`,
            `That's a common point of confusion! Think of **${topic}** like building blocks — each piece depends on understanding the one before it. Let me explain it differently...`,
        ],
        demonstrate: [
            `Here's how that works in practice:\n\n\`\`\`\nStep 1: Set up the environment\nStep 2: Apply the concept\nStep 3: Verify the result\n\`\`\`\n\nDoes that help clarify?`,
        ],
        try: [
            `Good attempt! You're on the right track. Consider how **${topic}** relates to the broader pattern we discussed. What would happen if you also considered edge cases?`,
        ],
        test: [
            `Stay focused on the quiz! You can ask me for help after you've completed it. Good luck! 🍀`,
        ],
        apply: [
            `That's a great real-world application! **${topic}** is indeed used that way in industry. You could take it further by...`,
        ],
    };
    const pool = responses[mode] || responses.explain;
    return pool[Math.floor(Math.random() * pool.length)];
}

export default function RightPanel({ subject, currentTopic, activeMode }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [threads, setThreads] = useState([]);
    const [activeThread, setActiveThread] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // In mock mode we don't load threads from a backend.
        setThreads([]);
    }, [subject?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = useCallback(async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input.trim(), time: Date.now() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        // Simulate AI
        setTimeout(() => {
            const aiContent = simulateAIResponse(input, currentTopic, activeMode);
            const aiMsg = { role: 'ai', content: aiContent, time: Date.now() };
            const final = [...newMessages, aiMsg];
            setMessages(final);
            setIsTyping(false);
            const chatId = activeThread || `t-${Date.now()}`;
            const threadName =
                activeThread
                    ? threads.find(t => t.id === activeThread)?.name || `Chat about ${currentTopic}`
                    : `Chat about ${currentTopic}`;

            setThreads(prev => {
                const existing = prev.find(t => t.id === chatId);
                if (existing) {
                    return prev.map(t => t.id === chatId ? { ...t, messages: final } : t);
                }
                return [...prev, { id: chatId, name: threadName, messages: final }];
            });

            if (!activeThread) {
                setActiveThread(chatId);
            }
        }, 600 + Math.random() * 800);
    }, [input, messages, activeThread, threads, currentTopic, activeMode]);

    const newChat = () => {
        setMessages([]);
        setActiveThread(null);
        setShowHistory(false);
    };

    const selectThread = (thread) => {
        setMessages(thread.messages || []);
        setActiveThread(thread.id);
        setShowHistory(false);
    };

    const removeThread = async (threadId) => {
        setThreads(prev => prev.filter(t => t.id !== threadId));
        if (activeThread === threadId) {
            setMessages([]);
            setActiveThread(null);
        }
    };

    const renameThread = async (threadId) => {
        if (!editName.trim()) return;
        const thread = threads.find(t => t.id === threadId);
        if (thread) {
            setThreads(prev => prev.map(t => t.id === threadId ? { ...t, name: editName.trim() } : t));
        }
        setEditingId(null);
        setEditName('');
    };

    const generateInfographic = () => {
        const msg = { role: 'ai', content: `📊 **Infographic Generated!**\n\nI've created a visual summary of **${currentTopic}** covering the key concepts, relationships, and important points. You can find it in the Library panel on the left.`, time: Date.now() };
        setMessages(prev => [...prev, msg]);
    };

    return (
        <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            background: 'var(--bg-card)', position: 'relative',
        }}>
            {/* Header */}
            <div style={{
                padding: '14px 16px', borderBottom: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(180deg, rgba(99,102,241,0.03) 0%, transparent 100%)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Bot size={14} style={{ color: 'white' }} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        AI Tutor
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={generateInfographic} title="Generate Infographic"
                        style={{
                            padding: '6px', borderRadius: 'var(--radius-sm)', background: 'transparent',
                            border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s',
                        }}>
                        <ImageIcon size={16} />
                    </button>
                    <button onClick={() => setShowHistory(!showHistory)} title="Chat History"
                        style={{
                            padding: '6px', borderRadius: 'var(--radius-sm)',
                            background: showHistory ? 'rgba(99,102,241,0.1)' : 'transparent',
                            border: 'none', cursor: 'pointer', color: showHistory ? 'var(--accent)' : 'var(--text-muted)',
                            transition: 'all 0.2s',
                        }}>
                        <History size={16} />
                    </button>
                    <button onClick={newChat} title="New Chat"
                        style={{
                            padding: '6px', borderRadius: 'var(--radius-sm)', background: 'transparent',
                            border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s',
                        }}>
                        <MessageSquarePlus size={16} />
                    </button>
                </div>
            </div>

            {/* Chat History Drawer */}
            {showHistory && (
                <div style={{
                    position: 'absolute', top: 52, left: 0, right: 0, bottom: 0,
                    background: 'var(--bg-card)', zIndex: 10,
                    borderTop: '1px solid var(--border-color)',
                    overflowY: 'auto', animation: 'fadeIn 0.15s ease-out',
                }}>
                    <div style={{ padding: '16px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
                        }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Chat History</span>
                            <button onClick={() => setShowHistory(false)} style={{
                                background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
                            }}>
                                <X size={16} />
                            </button>
                        </div>

                        {threads.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textAlign: 'center', padding: '32px 0' }}>
                                No previous chats
                            </p>
                        ) : (
                            threads.map(thread => (
                                <div key={thread.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                                    background: activeThread === thread.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                                    marginBottom: 4, cursor: 'pointer',
                                    transition: 'background 0.15s',
                                }} onClick={() => selectThread(thread)}>
                                    <MessageSquarePlus size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                    {editingId === thread.id ? (
                                        <input value={editName} onChange={e => setEditName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && renameThread(thread.id)}
                                            onBlur={() => renameThread(thread.id)} autoFocus
                                            style={{
                                                flex: 1, fontSize: '0.8125rem', padding: '2px 6px',
                                                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                                                borderRadius: 4, color: 'var(--text-primary)', outline: 'none',
                                            }}
                                        />
                                    ) : (
                                        <span style={{
                                            flex: 1, fontSize: '0.8125rem', color: 'var(--text-primary)',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>{thread.name}</span>
                                    )}
                                    <button onClick={(e) => { e.stopPropagation(); setEditingId(thread.id); setEditName(thread.name); }}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                                        <Pencil size={12} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); removeThread(thread.id); }}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '16px',
                display: 'flex', flexDirection: 'column', gap: 12,
            }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={24} style={{ color: 'var(--accent)' }} />
                        </div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                            Ask me anything
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            about <strong style={{ color: 'var(--accent)' }}>{currentTopic}</strong>
                        </p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}>
                        <div style={{
                            maxWidth: '88%', padding: '12px 16px', borderRadius: 16,
                            fontSize: '0.8125rem', lineHeight: 1.6,
                            animation: 'fadeIn 0.2s ease-out',
                            ...(msg.role === 'user' ? {
                                background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                                color: 'white', borderBottomRightRadius: 4,
                            } : {
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)', borderBottomLeftRadius: 4,
                            }),
                        }}>
                            {msg.content.split('\n').map((line, j) => {
                                if (line.startsWith('```')) return null;
                                const parts = line.split(/(\*\*.*?\*\*|\`.*?\`)/g);
                                return (
                                    <p key={j} style={{ margin: j > 0 ? '6px 0 0' : 0 }}>
                                        {parts.map((part, k) => {
                                            if (part.startsWith('**') && part.endsWith('**'))
                                                return <strong key={k}>{part.slice(2, -2)}</strong>;
                                            if (part.startsWith('`') && part.endsWith('`'))
                                                return <code key={k} style={{
                                                    background: msg.role === 'user' ? 'rgba(255,255,255,0.15)' : 'var(--bg-card)',
                                                    padding: '1px 6px', borderRadius: 4, fontSize: '0.8rem',
                                                }}>{part.slice(1, -1)}</code>;
                                            return part;
                                        })}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            padding: '12px 20px', borderRadius: 16, borderBottomLeftRadius: 4,
                            background: 'var(--bg-secondary)',
                            display: 'flex', gap: 4, alignItems: 'center',
                        }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)',
                                    animation: `float 1.4s ease-in-out infinite`,
                                    animationDelay: `${i * 0.2}s`,
                                }} />
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
                padding: '12px 14px', borderTop: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--bg-secondary)', borderRadius: 28,
                    padding: '4px 6px 4px 18px',
                    border: '1px solid var(--border-color)',
                    transition: 'border-color 0.2s',
                }}>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        style={{
                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                            fontSize: '0.8125rem', color: 'var(--text-primary)', padding: '8px 0',
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: input.trim() ? 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' : 'var(--bg-card)',
                            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s', flexShrink: 0,
                        }}
                    >
                        <Send size={14} style={{ color: input.trim() ? 'white' : 'var(--text-muted)' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
