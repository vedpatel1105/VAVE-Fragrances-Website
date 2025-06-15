import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabaseClient";

interface User {
    id: string;
    email: string;
    full_name: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
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
                    const { data, error } =
                        await supabase.auth.signInWithPassword({
                            email,
                            password,
                        });
                    if (error) throw error;
                    if (data.user) {
                        const { data: profile } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("id", data.user.id)
                            .single();
                        set({
                            user: {
                                id: data.user.id,
                                email: data.user.email!,
                                full_name: profile?.full_name || "",
                            },
                            isAuthenticated: true,
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    console.error("Login error:", error);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },
            logout: async () => {
                try {
                    const { error } = await supabase.auth.signOut();
                    // Ignore session_not_found error (406)
                    if (error && (error as any).status !== 403) throw error;
                    
                } catch (error: any) {
                    // Always clear state on logout, even if error
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    if (!error || error.status !== 403) {
                        console.error("Logout error:", error);
                        throw error;
                    }
                } finally {
                    set({ isLoading: false });
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    window.location.href = "/";
                }
            },
            checkAuth: async () => {
                try {
                    const {
                        data: { session },
                    } = await supabase.auth.getSession();
                    if (session?.user) {
                        const { data: profile } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("id", session.user.id)
                            .single();
                        set({
                            user: {
                                id: session.user.id,
                                email: session.user.email!,
                                full_name: profile?.full_name || "",
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
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: "auth-storage",
        }
    )
);
