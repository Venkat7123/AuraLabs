'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const user = localStorage.getItem('auralab-user');
    if (user) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-primary)',
    }}>
      <div className="animate-pulse-glow" style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
      }} />
    </div>
  );
}
