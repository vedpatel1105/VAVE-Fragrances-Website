"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/src/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting password reset for:", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/auth/reset-password`,
      });

      if (error) {
        console.error("Supabase reset error:", error);
        throw error;
      }

      console.log("Reset email sent successfully");
      toast({
        title: "Email Sent",
        description: "Check your email for the password reset link.",
      });

      router.push("/auth/check-your-email");
    } catch (error: any) {
      console.error("Forgot password handler error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-zinc-900 border border-white/5 rounded-none shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif text-white mb-2 tracking-tight">Recovery</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Restore access to your essence</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-white/50 ml-1">Email Address</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="bg-zinc-950 border-white/10 text-white rounded-none h-12 focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white hover:bg-zinc-200 text-black h-12 rounded-none text-[11px] uppercase tracking-[0.3em] font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  Send Link
                  <ArrowRight className="ml-2 h-3 w-3" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5 text-center">
          <Link
            href="/auth/login"
             className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-3 w-3" />
            Return to Sanctuary
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
