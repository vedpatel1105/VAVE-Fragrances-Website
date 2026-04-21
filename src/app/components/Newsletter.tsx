"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Mail, Gift, CheckCircle2, ArrowRight } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubscribed(true)
    }, 1500)
  }

  return (
    <section className="w-full py-32 bg-zinc-950 relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-8 md:p-16 text-center">
          <AnimatePresence mode="wait">
            {!isSubscribed ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/10 text-gold text-[10px] uppercase tracking-[0.3em] font-semibold mb-4">
                  <Sparkles className="h-3 w-3" /> Exclusive Invitation
                </div>
                
                <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight">
                  Join <span className="italic text-gold">The Scent Circle</span>
                </h2>
                
                <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                  Be the first to experience rare attars, seasonal collections, and olfactory secrets. 
                  <span className="block mt-2 font-medium text-white/60 italic">Receive a welcome gift upon entry.</span>
                </p>

                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-12 pr-4 bg-zinc-900/50 border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-gold/30 transition-all"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="h-14 px-8 bg-white text-black font-bold rounded-2xl hover:bg-gold hover:text-dark transition-all duration-500 flex items-center gap-2 group"
                  >
                    {isLoading ? "Inviting..." : (
                      <>Enter Circle <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </Button>
                </form>
                
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest pt-4">
                  Privacy honored • No noise, just fragrance
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 py-8"
              >
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20">
                  <Gift className="h-10 w-10 text-gold" />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-serif text-white">Welcome, Connoisseur.</h3>
                
                <div className="p-8 rounded-3xl bg-zinc-900 border border-gold/20 max-w-sm mx-auto space-y-4">
                  <p className="text-zinc-400 text-sm uppercase tracking-widest">Your Private Welcome Gift</p>
                  <div className="py-4 border-y border-white/5">
                    <span className="text-4xl font-bold tracking-tighter text-white">VAVE10</span>
                  </div>
                  <p className="text-xs text-gold">10% OFF YOUR FIRST COLLECTION</p>
                </div>

                <p className="text-zinc-500 text-sm italic">Check your inbox for further olfactory revelations.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
