"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, User, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CompactScentFinderAwareness() {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null)

  const moods = [
    { name: "Daily", color: "from-blue-500/20", icon: "☀️" },
    { name: "Evening", color: "from-purple-500/20", icon: "🌙" },
    { name: "Special", color: "from-amber-500/20", icon: "✨" }
  ]

  return (
    <section className="w-full py-40 md:py-60 relative bg-zinc-950 overflow-hidden border-t border-white/5">
      {/* Dynamic Aura Background */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {hoveredMood && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r ${moods.find(m => m.name === hoveredMood)?.color} to-transparent rounded-full blur-[150px]`}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Side: The Hook */}
            <div className="space-y-12 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40 uppercase tracking-[0.4em] mb-8">
                  <Sparkles className="w-3 h-3" />
                  <span>The Discovery Engine</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-tighter leading-[0.9]">
                  Find Your <br />
                  <span className="italic text-white/40">Scent.</span>
                </h2>
                <p className="text-white/30 max-w-lg mx-auto lg:mx-0 font-light text-lg md:text-xl leading-relaxed">
                  Confused by 100s of options? Our smart quiz finds your perfect match in just 60 seconds. Simple. Fast. Accurate.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: <User className="w-4 h-4" />, text: "Personalized for you" },
                  { icon: <Zap className="w-4 h-4" />, text: "Fast & Fun Quiz" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "98% Match accuracy" },
                  { icon: <Sparkles className="w-4 h-4" />, text: "Gift recommendations" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/40">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">{item.icon}</div>
                    <span className="text-xs uppercase tracking-widest">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link href="/scent-finder">
                  <Button className="h-20 px-16 bg-white text-black hover:bg-zinc-200 rounded-none text-xs uppercase tracking-[0.4em] font-black shadow-2xl group relative overflow-hidden">
                    <span className="relative z-10">Start The Quiz</span>
                    <motion.div 
                      className="absolute inset-0 bg-zinc-200"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                    <ArrowRight className="ml-4 w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side: The Visual Stage */}
            <div className="relative aspect-square flex items-center justify-center">
              {/* Central Portal */}
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-white/5 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-20 border border-white/5 rounded-full border-dashed"
                />
                
                <div className="relative z-10 bg-zinc-900/80 backdrop-blur-3xl border border-white/10 p-12 md:p-16 rounded-full w-4/5 h-4/5 flex flex-col items-center justify-center shadow-2xl">
                   <div className="text-center">
                      <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-6 font-mono">Select a vibe to preview</p>
                      <div className="flex gap-4 justify-center">
                        {moods.map((mood) => (
                          <button
                            key={mood.name}
                            onMouseEnter={() => setHoveredMood(mood.name)}
                            onMouseLeave={() => setHoveredMood(null)}
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-full border transition-all duration-500 flex flex-col items-center justify-center gap-1 ${
                              hoveredMood === mood.name ? 'bg-white border-white text-black scale-110 shadow-xl' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                            }`}
                          >
                            <span className="text-xl md:text-2xl">{mood.icon}</span>
                            <span className="text-[8px] uppercase tracking-tighter font-bold">{mood.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-12">
                         <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mb-6" />
                         <p className="text-xs text-white/40 uppercase tracking-[0.2em]">Our AI creates your unique scent profile instantly.</p>
                      </div>
                   </div>
                </div>

                {/* Floating Elements */}
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 left-10 text-2xl opacity-20">🌿</motion.div>
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-10 right-10 text-2xl opacity-20">🪵</motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/2 -right-4 text-2xl opacity-20">🍋</motion.div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
