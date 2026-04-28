"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/src/lib/supabaseClient";

export default function CallbackHashPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      router.replace("/auth/login?error=no_hash");
      return;
    }

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const redirectParam = new URLSearchParams(window.location.search).get("redirect") || "/profile";

    if (!access_token) {
      router.replace("/auth/login?error=no_access_token_in_hash");
      return;
    }

    (async () => {
      try {
        const client = getSupabaseClient();
        await client.auth.setSession({
          access_token,
          refresh_token: refresh_token ?? ""
        });

        router.replace(redirectParam);
      } catch (err) {
        console.error("Failed to set session from hash:", err);
        router.replace(`/auth/login?error=session_set_failed&details=${encodeURIComponent(String(err))}`);
      }
    })();
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center">Signing you in…</div>;
}
