"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      
      {/* Subtle Ambient Glow */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950" 
      />

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
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-none text-sm uppercase tracking-widest font-medium transition-all duration-500 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group flex items-center justify-center space-x-3"
            >
              <span>Explore Collection</span>
              <motion.span 
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >→</motion.span>
            </motion.button>
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
