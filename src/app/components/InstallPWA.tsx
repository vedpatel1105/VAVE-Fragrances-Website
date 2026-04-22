"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Show the popup only if not already installed and not dismissed in this session
      const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!isInstalled && !isDismissed) {
        // Small delay for better UX
        setTimeout(() => setIsVisible(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (isInstalled || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[100] font-sans"
      >
        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl overflow-hidden relative group">
          {/* Animated Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
               <Smartphone className="text-white w-7 h-7" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-serif text-white tracking-tight">The Vave Experience</h3>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-1 leading-relaxed">
                  Install our app for a faster, more cinematic fragrance journey.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleInstall}
                  className="bg-white text-black hover:bg-zinc-200 h-10 px-6 rounded-none text-[10px] uppercase tracking-[0.2em] font-bold transition-all"
                >
                  Download App
                </Button>
                <div className="flex items-center gap-1 text-[9px] text-white/20 uppercase tracking-widest font-medium">
                    Offline Access <div className="w-1 h-1 rounded-full bg-green-500/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
