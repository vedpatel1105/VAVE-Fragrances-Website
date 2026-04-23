"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ProductInfo } from "@/src/data/product-info"

const combinations = [
  { base: "Oceane", top: "Euphoria", result: "Ocean Bloom", vibe: "Fresh & Sweet" },
  { base: "Duskfall", top: "Obsession", result: "Dark Mystery", vibe: "Deep & Bold" },
  { base: "Havoc", top: "Velora", result: "Fresh Woods", vibe: "Warm & Clean" }
]

export default function CompactLayeringAwareness() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % combinations.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const current = combinations[index]
  const baseProd = ProductInfo.getProductByName(current.base)
  const topProd = ProductInfo.getProductByName(current.top)

  return (
    <section className="w-full py-24 md:py-40 relative bg-zinc-950 overflow-hidden">
      {/* Visual Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] text-amber-500 uppercase tracking-[0.3em] mb-6"
          >
            <Sparkles className="w-3 h-3" />
            <span>Mix Your Own Magic</span>
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-serif text-white mb-6 tracking-tight">
            Two Scents. <span className="italic text-white/40">One You.</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto font-light leading-relaxed text-sm md:text-base">
            Why wear just one? Combine any two Vave perfumes to create a secret smell that nobody else has. It's easy and fun.
          </p>
        </div>

        {/* Interactive Duo Card */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="relative bg-zinc-900/50 border border-white/5 p-8 md:p-16 rounded-3xl backdrop-blur-xl overflow-hidden group"
            >
              {/* Floating Petals/Particles */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-10 w-4 h-4 bg-amber-500/20 blur-sm rounded-full" 
              />
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -45, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 left-10 w-6 h-6 bg-blue-500/20 blur-sm rounded-full" 
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center">
                
                {/* Product A */}
                <div className="space-y-6">
                  <div className="relative h-48 md:h-64 mx-auto group-hover:scale-110 transition-transform duration-700">
                    <Image src={baseProd?.images["30"][0] || ""} alt="Scent A" fill className="object-contain" />
                  </div>
                  <div>
                    <h4 className="text-white font-serif text-xl">{current.base}</h4>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">The Foundation</p>
                  </div>
                </div>

                {/* The Plus Symbol */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-zinc-950 mb-4 shadow-lg">
                    <Plus className="w-6 h-6 text-white/60" />
                  </div>
                  <div className="h-20 w-px bg-gradient-to-b from-white/10 to-transparent hidden md:block" />
                </div>

                {/* Product B */}
                <div className="space-y-6">
                  <div className="relative h-48 md:h-64 mx-auto group-hover:scale-110 transition-transform duration-700 delay-100">
                    <Image src={topProd?.images["30"][0] || ""} alt="Scent B" fill className="object-contain" />
                  </div>
                  <div>
                    <h4 className="text-white font-serif text-xl">{current.top}</h4>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">The Spark</p>
                  </div>
                </div>

              </div>

              {/* The Resulting Mix */}
              <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="text-left">
                    <p className="text-[10px] text-amber-500/60 uppercase tracking-[0.4em] mb-2 font-mono">The New Magic</p>
                    <h3 className="text-3xl md:text-5xl font-serif text-white italic">{current.result}</h3>
                    <p className="text-sm text-white/30 mt-2">Vibe: {current.vibe}</p>
                 </div>
                 
                 <div className="flex gap-4">
                    <Link href="/layering">
                      <Button className="h-14 px-10 bg-white text-black hover:bg-zinc-200 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold">
                        Try This Mix
                      </Button>
                    </Link>
                    <button 
                      onClick={() => setIndex((prev) => (prev + 1) % combinations.length)}
                      className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Swipe Tip */}
        <p className="text-center mt-8 text-[9px] text-white/20 uppercase tracking-widest md:hidden">
          Tap the arrow to see more mixes
        </p>
      </div>
    </section>
  )
}
