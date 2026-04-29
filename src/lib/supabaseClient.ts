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
let supabaseAdminInstance: any = null;

export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;
  
  if (typeof window !== "undefined") {
    supabaseInstance = createClientComponentClient();
  } else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnon);
  }
  return supabaseInstance;
};

/**
 * Highly privileged client using service_role key.
 * ONLY use in server-side routes (API, Middleware, Server Actions).
 * NEVER use on client-side or export to components.
 */
export const getSupabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to anon client.");
    return getSupabaseClient();
  }

  if (supabaseAdminInstance) return supabaseAdminInstance;
  
  supabaseAdminInstance = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  return supabaseAdminInstance;
};

// WE ARE REMOVING THE STATIC 'supabase' EXPORT TO PREVENT INITIALIZATION CRASHES
// ALL FILES MUST NOW USE getSupabaseClient()
