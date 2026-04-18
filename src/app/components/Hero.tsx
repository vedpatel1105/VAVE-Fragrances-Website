"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      
      {/* Subtle Ambient Glow (Optional, for pure aesthetic depth on black) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center text-center h-full pt-16">
        
        {/* Subtle Accent Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/70 mb-6 font-medium"
        >
          The Art of Fine Perfumery
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight select-none"
        >
          Discover Your <br className="hidden md:block" />
          <span className="italic font-light text-white/90">Signature</span> Scent
        </motion.h1>

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8"
        >
          <Link href="/collection">
            <button className="px-10 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm uppercase tracking-widest font-medium transition-all duration-500 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group">
              Explore Collection
              <span className="inline-block ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </Link>
        </motion.div>

        {/* Minimal Secondary Navigation Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="absolute bottom-12 flex items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-white/40"
        >
          <Link href="/scent-finder" className="hover:text-white transition-colors duration-300">
            Scent Finder
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <Link href="/layering" className="hover:text-white transition-colors duration-300">
            Layering
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <a href="#featured" className="hover:text-white transition-colors duration-300">
            Featured
          </a>
        </motion.div>
      </div>
    </section>
  )
}
