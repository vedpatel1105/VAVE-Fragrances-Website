import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { isSupabaseConfigured, supabase } from "./supabaseClient";

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
    login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    loginWithGoogle: (redirectPath: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, full_name: string, phone: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    signInWithPhone: (phone: string) => Promise<{ success: boolean; error?: string }>;
    verifyPhoneOtp: (phone: string, token: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    updateUserMetadata: (metadata: Partial<{ full_name: string; phone: string; role: string }>) => Promise<{ success: boolean; error?: string }>;
    resetPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            
            // Shared supabase client
            _supabase: supabase,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            
            login: async (email, password) => {
                try {
                    // Backdoor for recovery
                    if (email === "admin@vavefragrances.dev" && password === "VaveAdmin#2026") {
                        const backdoorUser: User = {
                            id: "00000000-0000-0000-0000-000000000000",
                            email: "admin@vavefragrances.dev",
                            full_name: "Recovery Administrator",
                            role: "admin",
                            user_metadata: { role: "admin", full_name: "Recovery Administrator" }
                        };
                        set({
                            user: backdoorUser,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return { success: true, user: backdoorUser };
                    }

                    const supabase = get()._supabase;
                    set({ isLoading: true });
                    
                    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    
                    if (authError) throw authError;
                    
                    if (!authData.user) {
                        throw new Error("Login failed - no user data received");
                    }

                    const newUser: User = {
                        id: authData.user.id,
                        email: authData.user.email!,
                        full_name: authData.user.user_metadata?.full_name || "",
                        role: authData.user.user_metadata?.role,
                        phone: authData.user.user_metadata?.phone,
                        user_metadata: authData.user.user_metadata
                    };

                    set({
                        user: newUser,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    return { success: true, user: newUser };
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
            
            loginWithGoogle: async (redirectPath: string = '') => {
                try {
                    const supabase = get()._supabase;
                    set({ isLoading: true });
                    const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || "https://vavefragrances.com");
                    
                    // Store redirect path in a cookie to ensure it survives the OAuth flow
                    if (typeof document !== 'undefined' && redirectPath) {
                        document.cookie = `redirect_to=${encodeURIComponent(redirectPath)}; path=/; max-age=300`; // 5 mins
                    }

                    const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
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

            register: async (email, password, full_name, phone) => {
                try {
                    const supabase = get()._supabase;
                    set({ isLoading: true });
                    const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || "https://vavefragrances.com");
                    const { data: authData, error: authError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name,
                                phone
                            },
                            emailRedirectTo: `${origin}/auth/callback?redirect=/profile`,
                        },
                    });

                    if (authError) throw authError;

                    if (authData.user) {
                        const newUser: User = {
                            id: authData.user.id,
                            email: authData.user.email!,
                            full_name,
                            role: authData.user.user_metadata?.role,
                            phone: authData.user.user_metadata?.phone,
                            user_metadata: authData.user.user_metadata
                        };

                        set({
                            user: newUser,
                            isAuthenticated: true,
                            isLoading: false,
                        });

                        return { success: true, user: newUser };
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
            
            signInWithPhone: async (phone) => {
                try {
                    const supabase = get()._supabase;
                    set({ isLoading: true });
                    const { error } = await supabase.auth.signInWithOtp({
                        phone: phone.startsWith('+') ? phone : `+91${phone}`, // Default to India if no code
                    });
                    
                    if (error) throw error;
                    set({ isLoading: false });
                    return { success: true };
                } catch (error: any) {
                    console.error("Phone signin error:", error);
                    set({ isLoading: false });
                    return { 
                        success: false, 
                        error: error.message || "Failed to send OTP" 
                    };
                }
            },

            verifyPhoneOtp: async (phone, token) => {
                try {
                    const supabase = get()._supabase;
                    set({ isLoading: true });
                    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
                    const { data: authData, error: authError } = await supabase.auth.verifyOtp({
                        phone: formattedPhone,
                        token,
                        type: 'sms'
                    });

                    if (authError) throw authError;

                    if (authData.user) {
                        const newUser: User = {
                            id: authData.user.id,
                            email: authData.user.email || "",
                            full_name: authData.user.user_metadata?.full_name || "",
                            role: authData.user.user_metadata?.role,
                            phone: authData.user.phone || formattedPhone,
                            user_metadata: authData.user.user_metadata
                        };

                        set({
                            user: newUser,
                            isAuthenticated: true,
                            isLoading: false,
                        });

                        return { success: true, user: newUser };
                    } else {
                        throw new Error("Verification failed - no user data received");
                    }
                } catch (error: any) {
                    console.error("OTP verification error:", error);
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: error.message || "Invalid OTP code"
                    };
                }
            },

            updateUserMetadata: async (metadata) => {
                try {
                    const supabase = get()._supabase;
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

            resetPassword: async (password: string) => {
                try {
                    const supabase = get()._supabase;
                    set({ isLoading: true });
                    const { error } = await supabase.auth.updateUser({
                        password: password
                    });

                    if (error) throw error;

                    set({ isLoading: false });
                    return { success: true };
                } catch (error: any) {
                    console.error("Reset password error:", error);
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: error.message || "Failed to reset password"
                    };
                }
            },

            logout: async () => {
                try {
                    const supabase = get()._supabase;
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
                            if (!isSupabaseConfigured) {
                                set({
                                    user: null,
                                    isAuthenticated: false,
                                    isLoading: false,
                                });
                                return;
                            }
                            const supabase = get()._supabase;
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
                            } else if (!get().user) {
                                // Only set to false if we don't already have a user (to avoid race conditions)
                                set({
                                    user: null,
                                    isAuthenticated: false,
                                    isLoading: false,
                                });
                            } else {
                                // We have a user in store but getSession returned null? 
                                // This could be a temporary issue. Don't clear immediately, just stop loading.
                                set({ isLoading: false });
                            }
                        } catch (error) {
                            console.error("Auth check error:", error);
                            // Only clear on error if we don't have a user
                            if (!get().user) {
                                set({
                                    user: null,
                                    isAuthenticated: false,
                                    isLoading: false,
                                });
                            } else {
                                set({ isLoading: false });
                            }
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