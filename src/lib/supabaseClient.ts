import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Exported flag to check configuration
export const isSupabaseConfigured = Boolean(envSupabaseUrl && 
  envSupabaseAnonKey && 
  envSupabaseAnonKey !== 'paste_your_anon_key_here');

const supabaseUrl = envSupabaseUrl || "https://tuqdytehmpzhlbxfvylv.supabase.co";
const supabaseAnon = envSupabaseAnonKey || "placeholder-anon-key";

// Singleton instance with lazy initialization - THIS IS THE ONLY SAFE WAY
let supabaseInstance: any = null;

export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;
  
  if (typeof window !== "undefined") {
    supabaseInstance = createClientComponentClient();
  } else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnon);
  }
  return supabaseInstance;
};

// WE ARE REMOVING THE STATIC 'supabase' EXPORT TO PREVENT INITIALIZATION CRASHES
// ALL FILES MUST NOW USE getSupabaseClient()
