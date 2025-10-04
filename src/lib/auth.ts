import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabaseClient";

interface User {
    user_metadata: any;
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
    role?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, full_name: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    updateUserMetadata: (metadata: Partial<{ full_name: string; phone: string; role: string }>) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            
            login: async (email, password) => {
                try {
                    set({ isLoading: true });
                    
                    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    
                    if (authError) throw authError;
                    
                    if (!authData.user) {
                        throw new Error("Login failed - no user data received");
                    }

                    set({
                        user: {
                            id: authData.user.id,
                            email: authData.user.email!,
                            full_name: authData.user.user_metadata?.full_name || "",
                            role: authData.user.user_metadata?.role,
                            phone: authData.user.user_metadata?.phone,
                            user_metadata: authData.user.user_metadata
                        },
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    return { success: true };
                } catch (error: any) {
                    console.error("Login error:", error);
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    return { 
                        success: false, 
                        error: error.message || "An error occurred during login" 
                    };
                }
            },
            
            loginWithGoogle: async () => {
                try {
                    set({ isLoading: true });
                    const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: `${window.location.origin}/auth/callback`,
                            queryParams: {
                                access_type: 'offline',
                                prompt: 'consent',
                            },
                        },
                    });

                    if (error) throw error;
                    return { success: true };
                } catch (error: any) {
                    console.error("Google login error:", error);
                    set({ isLoading: false });
                    return { 
                        success: false, 
                        error: error.message || "Failed to login with Google" 
                    };
                }
            },

            register: async (email, password, full_name) => {
                try {
                    set({ isLoading: true });
                    
                    const { data: authData, error: authError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name,
                            },
                        },
                    });

                    if (authError) throw authError;

                    if (authData.user) {
                        set({
                            user: {
                                id: authData.user.id,
                                email: authData.user.email!,
                                full_name,
                                role: authData.user.user_metadata?.role,
                                phone: authData.user.user_metadata?.phone,
                                user_metadata: authData.user.user_metadata
                            },
                            isAuthenticated: true,
                            isLoading: false,
                        });

                        return { success: true };
                    } else {
                        throw new Error("Registration failed - no user data received");
                    }
                } catch (error: any) {
                    console.error("Registration error:", error);
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    return {
                        success: false,
                        error: error.message || "An error occurred during registration"
                    };
                }
            },

            updateUserMetadata: async (metadata) => {
                try {
                    set({ isLoading: true });
                    
                    const { data: { user }, error } = await supabase.auth.updateUser({
                        data: metadata
                    });

                    if (error) throw error;

                    if (user) {
                        set((state) => ({
                            user: {
                                ...state.user!,
                                ...metadata,
                            },
                            isLoading: false,
                        }));
                        return { success: true };
                    } else {
                        throw new Error("Failed to update user metadata");
                    }
                } catch (error: any) {
                    console.error("Update metadata error:", error);
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: error.message || "Failed to update user metadata"
                    };
                }
            },

            logout: async () => {
                try {
                    const { error } = await supabase.auth.signOut();
                    if (error) throw error;
                } catch (error: any) {
                    console.error("Logout error:", error);
                } finally {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            },

            checkAuth: (() => {
                let lastCheck = 0;
                let checkPromise: Promise<void> | null = null;
                const minInterval = 1000; // Minimum 1 second between checks
                
                return async () => {
                    const now = Date.now();
                    if (now - lastCheck < minInterval && checkPromise) {
                        await checkPromise; // Await existing promise if called too soon
                        return;
                    }
                    lastCheck = now;
                    
                    checkPromise = (async () => {
                        try {
                            const { data: { session } } = await supabase.auth.getSession();
                            
                            if (session?.user) {
                                set({
                                    user: {
                                        id: session.user.id,
                                        email: session.user.email!,
                                        full_name: session.user.user_metadata?.full_name || "",
                                        role: session.user.user_metadata?.role,
                                        phone: session.user.user_metadata?.phone,
                                        user_metadata: session.user.user_metadata
                                    },
                                    isAuthenticated: true,
                                    isLoading: false,
                                });
                            } else {
                                set({
                                    user: null,
                                    isAuthenticated: false,
                                    isLoading: false,
                                });
                            }
                        } catch (error) {
                            console.error("Auth check error:", error);
                            set({
                                user: null,
                                isAuthenticated: false,
                                isLoading: false,
                            });
                        }
                    })();
                    
                    await checkPromise;
                };
            })(),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);