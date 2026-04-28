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

// Singleton instance with lazy initialization
let supabaseInstance: any = null;

export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;
  
  if (typeof window !== "undefined") {
    // Client-side: use the auth helper
    supabaseInstance = createClientComponentClient();
  } else {
    // Server-side: use standard client
    supabaseInstance = createClient(supabaseUrl, supabaseAnon);
  }
  return supabaseInstance;
};

// Export a getter instead of a static constant to prevent initialization loops
export const supabase = typeof window !== "undefined" 
  ? createClientComponentClient() // Immediate for components
  : createClient(supabaseUrl, supabaseAnon); // Immediate for server
