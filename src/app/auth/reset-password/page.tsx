"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/src/lib/auth";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { resetPassword, checkAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  // Check if user is authenticated (they should be after clicking the recovery link)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(password);
      if (result.success) {
        setIsSuccess(true);
        toast({
          title: "Password Updated",
          description: "Your password has been successfully reset.",
        });
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setError(result.error || "Failed to reset password. The link may have expired.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans selection:bg-white selection:text-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[450px] bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-none shadow-2xl relative z-10 overflow-hidden"
      >
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 left-0 h-[1px] w-full bg-white z-50"
            />
          )}
        </AnimatePresence>

        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 tracking-tight">New Beginnings</h1>
            <p className="text-[12px] uppercase tracking-[0.3em] text-white/50 font-medium">Create your new secure password</p>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white mb-2">Success</h2>
                  <p className="text-[11px] uppercase tracking-widest text-white/40 leading-relaxed">
                    Your password has been restored. Redirecting you to the sanctuary...
                  </p>
                </div>
                <Button 
                  onClick={() => router.push("/auth/login")}
                  className="w-full bg-white text-black hover:bg-zinc-200 h-14 rounded-none text-[10px] uppercase tracking-[0.3em] font-bold"
                >
                  Return Now
                </Button>
              </motion.div>
            ) : (
              <motion.form 
                key="reset-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit} 
                className="space-y-8"
              >
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-red-400 uppercase tracking-widest leading-relaxed">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-white/80 font-semibold flex items-center gap-2">
                    <Lock size={12} className="opacity-70" />
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-zinc-950 border-white/10 text-white rounded-none h-14 focus:border-white/40 focus:ring-0 transition-all placeholder:text-zinc-500 text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-white/80 font-semibold flex items-center gap-2">
                    <Lock size={12} className="opacity-70" />
                    Confirm Password
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-zinc-950 border-white/10 text-white rounded-none h-14 focus:border-white/40 focus:ring-0 transition-all placeholder:text-zinc-500 text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-white hover:bg-zinc-200 text-black h-16 rounded-none text-[11px] uppercase tracking-[0.4em] font-bold shadow-xl transition-all duration-500 disabled:opacity-50" 
                  disabled={isLoading}
                >
                  {isLoading ? "Restoring..." : "Reset Password"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="w-10 h-[1px] bg-white/20 relative overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
