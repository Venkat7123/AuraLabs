'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('auralab-theme') || 'dark';
        setTheme(saved);
        document.documentElement.classList.toggle('dark', saved === 'dark');
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('auralab-theme', next);
        document.documentElement.classList.toggle('dark', next === 'dark');
    };

    if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
