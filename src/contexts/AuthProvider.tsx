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

    useEffect(() => {
        // Initial auth check
        auth.checkAuth();

        const client = getSupabaseClient();

        // Listen for auth state changes
        const { data: { subscription } } = client.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    if (session?.user) {
                        auth.setUser({
                            id: session.user.id,
                            email: session.user.email!,
                            user_metadata: session.user.user_metadata,
                            full_name: session.user.user_metadata?.full_name || "",
                            role: session.user.user_metadata?.role || "",
                            phone: session.user.user_metadata?.phone || "",
                        });
                    }
                }
                if (event === 'SIGNED_OUT') {
                    auth.setUser(null);
                }
            }
        );

        // Cleanup subscription
        return () => {
            subscription.unsubscribe();
        };
    }, [auth]);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}
