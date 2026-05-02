import { createBrowserClient } from "@supabase/ssr";

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Exported flag to check configuration
export const isSupabaseConfigured = Boolean(envSupabaseUrl && 
  envSupabaseAnonKey && 
  envSupabaseAnonKey !== 'paste_your_anon_key_here');

const supabaseUrl = envSupabaseUrl || "https://tuqdytehmpzhlbxfvylv.supabase.co";
const supabaseAnon = envSupabaseAnonKey || "placeholder-anon-key";

/**
 * Client-side Supabase client using @supabase/ssr
 * Uses a singleton pattern to prevent multiple instances
 */
let supabaseBrowserClient: any = null;

export const getSupabaseClient = () => {
  if (typeof window === "undefined") {
    // Return a basic client if called server-side (should ideally use getSupabaseServer instead)
    return createBrowserClient(supabaseUrl, supabaseAnon);
  }

  if (supabaseBrowserClient) return supabaseBrowserClient;
  
  supabaseBrowserClient = createBrowserClient(supabaseUrl, supabaseAnon);
  return supabaseBrowserClient;
};
