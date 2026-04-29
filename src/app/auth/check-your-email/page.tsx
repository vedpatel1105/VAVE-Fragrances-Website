"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckYourEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans selection:bg-white selection:text-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[450px] bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-none shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="p-8 sm:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/5 relative">
                <Mail className="w-8 h-8 text-white opacity-80" />
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-white/20"
                />
            </div>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-serif text-white mb-4 tracking-tight">Check Your Inbox</h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 leading-relaxed max-w-[280px] mx-auto">
              We have sent a verification link to your essence. Please follow the path in your email to restore access.
            </p>
          </div>

          <div className="space-y-6">
            <Link href="https://mail.google.com" target="_blank">
                <Button 
                className="w-full bg-white hover:bg-zinc-200 text-black h-14 rounded-none text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl transition-all duration-500" 
                >
                Open Mail App
                </Button>
            </Link>
            
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                Didn't receive anything? <Link href="/auth/forgot-password" className="text-white hover:underline">Try again</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="py-8 bg-white/5 border-t border-white/10 text-center">
          <Link 
            href="/auth/login" 
            className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={12} />
            Return to Sanctuary
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
