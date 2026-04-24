import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Exported flag to check configuration anywhere in the app
export const isSupabaseConfigured = Boolean(envSupabaseUrl && 
  envSupabaseAnonKey && 
  envSupabaseAnonKey !== 'paste_your_anon_key_here');

const supabaseUrl = envSupabaseUrl || "https://tuqdytehmpzhlbxfvylv.supabase.co";
const supabaseAnon = envSupabaseAnonKey || "placeholder-anon-key";

// Singleton instance
let supabaseInstance: any;

export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;
  
  if (typeof window !== "undefined") {
    supabaseInstance = createClientComponentClient();
  } else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnon);
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();
