import { createClient } from "@supabase/supabase-js";

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Exported flag to check configuration anywhere in the app
export const isSupabaseConfigured = Boolean(envSupabaseUrl && 
  envSupabaseAnonKey && 
  envSupabaseAnonKey !== 'paste_your_anon_key_here');

if (!isSupabaseConfigured) {
  const message = "Supabase configuration is missing or incomplete. Some features will be disabled.";
  if (typeof window !== "undefined") {
    if (!(window as any)._supabaseLogOnce) {
      console.warn(message);
      (window as any)._supabaseLogOnce = true;
    }
  } else {
    console.warn(message);
  }
}

const supabaseUrl = envSupabaseUrl || "https://tuqdytehmpzhlbxfvylv.supabase.co";
const supabaseAnon = envSupabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnon);
