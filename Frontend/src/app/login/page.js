'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && user) {
            router.replace('/dashboard');
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const { error: signInError } = await signIn(form.email, form.password);
            if (signInError) throw signInError;
            // Success: AuthContext will pick up the change and we'll redirect via the useEffect
        } catch (err) {
            setError(err.message || 'Failed to sign in');
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Left — Illustration */}
            <div style={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
            }}
                className="hidden md:flex"
            >
                <div className="auth-bg-pattern" />
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    padding: '40px',
                    maxWidth: 500,
                }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                    }}>
                        <span style={{ fontSize: 36, fontWeight: 800, color: 'white' }}>A</span>
                    </div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: 'white',
                        marginBottom: 12,
                        letterSpacing: '-0.025em',
                    }}>AuraLab</h1>
                    <p style={{
                        fontSize: '1.125rem',
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.6,
                    }}>
                        AI-powered learning that adapts to you. Master any subject with personalized curriculums, interactive quizzes, and intelligent guidance.
                    </p>

                    {/* Floating decorative orbs */}
                    <div className="animate-float" style={{
                        position: 'absolute',
                        top: '15%',
                        left: '10%',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'rgba(139, 92, 246, 0.2)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(139, 92, 246, 0.15)',
                    }} />
                    <div className="animate-float" style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '15%',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'rgba(99, 102, 241, 0.25)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(99, 102, 241, 0.15)',
                        animationDelay: '1s',
                    }} />
                    <div className="animate-float" style={{
                        position: 'absolute',
                        top: '60%',
                        left: '20%',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'rgba(168, 85, 247, 0.3)',
                        animationDelay: '2s',
                    }} />
                </div>
            </div>

            {/* Right — Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 24px',
                background: 'var(--bg-primary)',
            }}>
                <div className="animate-fade-in" style={{ width: '100%', maxWidth: 420 }}>
                    {/* Mobile logo */}
                    <div className="md:hidden" style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{
                            width: 56,
                            height: 56,
                            borderRadius: 14,
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 12,
                        }}>
                            <span style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>A</span>
                        </div>
                        <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>AuraLab</h2>
                    </div>

                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: 8,
                    }}>Welcome back</h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: 32,
                        fontSize: '0.9375rem',
                    }}>Sign in to continue your learning journey</p>

                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 'var(--radius-md)',
                            padding: '12px 16px',
                            marginBottom: 20,
                            color: 'var(--danger)',
                            fontSize: '0.875rem',
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                marginBottom: 8,
                            }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{
                                    position: 'absolute',
                                    left: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                }} />
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    style={{ paddingLeft: 44 }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                marginBottom: 8,
                            }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{
                                    position: 'absolute',
                                    left: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                }} />
                                <input
                                    className="input"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    style={{ paddingLeft: 44, paddingRight: 44 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute',
                                        right: 14,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                        padding: 0,
                                    }}
                                >
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 24,
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: '0.8125rem',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                            }}>
                                <input type="checkbox" style={{
                                    accentColor: 'var(--accent)',
                                    width: 16,
                                    height: 16,
                                }} />
                                Remember me
                            </label>
                            <a href="#" style={{
                                fontSize: '0.8125rem',
                                color: 'var(--accent)',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}>Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: '100%', padding: '14px', fontSize: '0.9375rem' }}
                        >
                            {loading ? (
                                <span className="animate-pulse-glow" style={{
                                    width: 20, height: 20, borderRadius: '50%',
                                    border: '2px solid white', borderTopColor: 'transparent',
                                    display: 'inline-block',
                                    animation: 'spin 0.6s linear infinite',
                                }} />
                            ) : (
                                <>Sign In <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        margin: '28px 0',
                    }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or continue with</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                    </div>

                    {/* Social Login */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    <p style={{
                        textAlign: 'center',
                        marginTop: 32,
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                    }}>
                        Don&apos;t have an account?{' '}
                        <a href="/signup" style={{
                            color: 'var(--accent)',
                            textDecoration: 'none',
                            fontWeight: 600,
                        }}>Create account</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
