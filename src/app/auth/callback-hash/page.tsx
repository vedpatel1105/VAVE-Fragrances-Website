// app/auth/callback-hash/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabaseClient"; // ensure this is the browser supabase client

export default function CallbackHashPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash; // includes leading '#'
    if (!hash) {
      router.replace("/auth/login?error=no_hash");
      return;
    }

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const provider_token = params.get("provider_token");
    const redirectParam = new URLSearchParams(window.location.search).get("redirect") || "/profile";

    if (!access_token) {
      // nothing to do
      router.replace("/auth/login?error=no_access_token_in_hash");
      return;
    }

    (async () => {
      try {
        // supabase-js v2 supports auth.setSession
        await supabase.auth.setSession({
          access_token,
          refresh_token: refresh_token ?? ""
        });

        // optionally store provider token if needed (not always supported)
        // redirect to intended page
        router.replace(redirectParam);
      } catch (err) {
        console.error("Failed to set session from hash:", err);
        router.replace(`/auth/login?error=session_set_failed&details=${encodeURIComponent(String(err))}`);
      }
    })();
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center">Signing you in…</div>;
}
