// app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  try {
    const cookieStore = await cookies();

    // create server supabase client (uses cookie wrapper)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          // returns all cookies as expected by @supabase/ssr
          getAll() {
            return cookieStore.getAll();
          },
          // supabase will call setAll([{ name, value, options }])
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            // iterate and set on Next's cookieStore
            for (const c of cookiesToSet) {
              try {
                // cookieStore.set accepts either (name, value, options) or an object
                if (c.options && typeof c.options === "object") {
                  cookieStore.set({
                    name: c.name,
                    value: c.value,
                    ...c.options,
                  });
                } else {
                  cookieStore.set(c.name, c.value);
                }
              } catch (e) {
                // fall back to simple set if structure mismatches
                cookieStore.set(c.name, c.value);
              }
            }
          },
        },
      }
    );

    // parse params
    const code = requestUrl.searchParams.get("code");
    const access_token = requestUrl.searchParams.get("access_token");
    const refresh_token =
      requestUrl.searchParams.get("refresh_token") ||
      requestUrl.searchParams.get("provider_refresh_token");
    const error = requestUrl.searchParams.get("error");
    const errorDescription = requestUrl.searchParams.get("error_description");

    if (error) {
      console.error("OAuth provider error:", error, errorDescription);
      return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error)}`, origin));
    }

    let sessionResult: any = null;

    if (code) {
      // Preferred: exchange authorization code (PKCE) for session
      const { data, error: exErr } = await supabase.auth.exchangeCodeForSession(code);
      if (exErr) {
        console.error("exchangeCodeForSession error:", exErr);
        return NextResponse.redirect(
          new URL(`/auth/login?error=session_error&details=${encodeURIComponent(exErr.message ?? String(exErr))}`, origin)
        );
      }
      sessionResult = data;
    } else if (access_token) {
      // Fallback: provider returned tokens directly in query string
      const { data, error: setErr } = await supabase.auth.setSession({
        access_token,
        refresh_token: refresh_token ?? "",
      });
      if (setErr) {
        console.error("auth.setSession error:", setErr);
        return NextResponse.redirect(
          new URL(`/auth/login?error=set_session_error&details=${encodeURIComponent(setErr.message ?? String(setErr))}`, origin)
        );
      }
      sessionResult = data;
    } else {
      // No code and no token — maybe provider returned #fragment instead of query string
      console.warn("No code or access_token found; redirecting to fallback handler.");
      
      const searchParams = requestUrl.searchParams.toString();
      const hashUrl = new URL(`/auth/callback-hash${searchParams ? `?${searchParams}` : ''}`, origin);
      return NextResponse.redirect(hashUrl);
    }

    const user = sessionResult?.user ?? sessionResult?.session?.user;
    if (!user) {
      console.error("No user available in session result:", sessionResult);
      return NextResponse.redirect(new URL("/auth/login?error=no_user_in_session", origin));
    }

    // Upsert profile (non-fatal)
    try {
      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: (user.email as string) ?? "",
          full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
          avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? "",
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });
    } catch (upsertErr) {
      console.error("Profile upsert failed (non-fatal):", upsertErr);
    }

    // Safe redirect (prevent open redirect)
    const cookieRedirect = cookieStore.get("redirect_to")?.value;
    let redirectTo = requestUrl.searchParams.get("redirect") || cookieRedirect || "/profile";
    try {
      const safe = new URL(redirectTo, origin);
      if (safe.origin !== origin) redirectTo = "/profile";
    } catch {
      redirectTo = "/profile";
    }

    return NextResponse.redirect(new URL(redirectTo, origin));
  } catch (err) {
    console.error("Unexpected error in auth callback:", err);
    return NextResponse.redirect(
      new URL(`/auth/login?error=unexpected_error&details=${encodeURIComponent(String(err))}`, new URL(request.url).origin)
    );
  }
}
