import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = envSupabaseUrl || "https://tuqdytehmpzhlbxfvylv.supabase.co";
const supabaseAnon = envSupabaseAnonKey || "placeholder-anon-key";

/**
 * Server-side Supabase client using @supabase/ssr
 * This requires 'next/headers' which can only be used in Server Components/Actions/Routes.
 */
export const getSupabaseServer = async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignored if called from Server Component
        }
      },
    },
  });
};

/**
 * Highly privileged client using service_role key.
 * ONLY use in server-side routes (API, Middleware, Server Actions).
 */
export const getSupabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
  }

  return createServerClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    cookies: {
      getAll() { return []; },
      setAll() { }
    }
  });
};
