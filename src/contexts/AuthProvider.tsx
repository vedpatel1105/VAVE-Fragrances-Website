'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/src/lib/auth';
import { getSupabaseClient } from '@/src/lib/supabaseClient';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

const AuthContext = createContext<ReturnType<typeof useAuthStore> | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuthStore();
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        // Initial auth check
        checkAuth();

        const client = getSupabaseClient();

        // Listen for auth state changes
        const { data: { subscription } } = client.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    if (session?.user) {
                        setUser({
                            id: session.user.id,
                            email: session.user.email || "",
                            user_metadata: session.user.user_metadata,
                            full_name: session.user.user_metadata?.full_name || "",
                            role: session.user.user_metadata?.role || "",
                            phone: session.user.user_metadata?.phone || "",
                        });
                    }
                }
                if (event === 'SIGNED_OUT') {
                    setUser(null);
                }
            }
        );

        // Cleanup subscription
        return () => {
            subscription.unsubscribe();
        };
    }, [checkAuth, setUser]);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}
