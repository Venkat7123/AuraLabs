'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({
    user: null,
    session: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check for initial session
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error fetching session:', error.message);
            }
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        checkSession();

        // 2. Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const val = {
        user,
        session,
        loading,
        signOut: () => supabase.auth.signOut(),
    };

    return <AuthContext.Provider value={val}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
