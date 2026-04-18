import { createClient } from "@supabase/supabase-js";

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Provide safe fallbacks to prevent runtime crash when env vars are missing.
// Operations will still fail against placeholder values, but the app can boot.
export const isSupabaseConfigured = Boolean(envSupabaseUrl && envSupabaseAnonKey);

if (!isSupabaseConfigured) {
	const message =
		"Supabase environment variables are missing (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY). Using fallback local configuration.";
	if (typeof window !== "undefined") {
		// Only log once in the browser to avoid console spam
		if (!(window as any)._supabaseLogOnce) {
			console.warn(message);
			(window as any)._supabaseLogOnce = true;
		}
	} else {
		console.warn(message);
	}
}

const supabaseUrl = envSupabaseUrl || "http://localhost";
const supabaseAnon = envSupabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnon);
