import { createClient } from "@supabase/supabase-js";

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Provide safe fallbacks to prevent runtime crash when env vars are missing.
// Operations will still fail against placeholder values, but the app can boot.
const hasValidEnv = Boolean(envSupabaseUrl && envSupabaseAnonKey);
if (!hasValidEnv) {
	const message =
		"Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";
	if (typeof window !== "undefined") {
		console.error(message);
	} else {
		console.warn(message);
	}
}

const supabaseUrl = envSupabaseUrl || "http://localhost";
const supabaseAnon = envSupabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnon);
