"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[90vh] md:h-screen bg-zinc-950 overflow-hidden flex items-center justify-center px-6"
    >
      {/* ── CINEMATIC SCENT AURA (Background) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Glow 1 */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] bg-zinc-800/20 blur-[120px] rounded-full"
        />
        {/* Animated Glow 2 */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[80%] h-[80%] bg-zinc-800/10 blur-[120px] rounded-full"
        />
        
        {/* Floating Particles (Scent Notes) */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: [0, 0.5, 0], 
                y: [-20, -120],
                x: Math.sin(i) * 50
              }}
              transition={{ 
                duration: 8 + i * 2, 
                repeat: Infinity, 
                delay: i * 3,
                ease: "easeInOut" 
              }}
              className="absolute w-px h-24 bg-gradient-to-t from-transparent via-white/40 to-transparent"
              style={{ left: `${20 + i * 15}%`, top: '60%' }}
            />
          ))}
        </div>
      </div>

      {/* ── EDITORIAL TYPOGRAPHY (Main Content) ── */}
      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 flex flex-col items-center max-w-4xl w-full text-center"
      >
        {/* Brand Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-[10px] md:text-[12px] uppercase tracking-[0.8em] text-white/40 font-montserrat">
            Vave Extraits De Parfum
          </span>
        </motion.div>

        {/* Main Title */}
        <div className="mb-12 relative">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-playfair text-white leading-[1] tracking-tight uppercase text-5xl sm:text-6xl md:text-8xl lg:text-9xl"
          >
            The Art of <br />
            <span className="italic font-serif lowercase opacity-50 block mt-2">Presence</span>
          </motion.h1>
          
          {/* Subtle Accent Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="h-px w-24 bg-white/10 mx-auto mt-12"
          />
        </div>

        {/* Brand Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="text-white/30 text-[13px] md:text-[16px] font-light max-w-lg mb-16 font-montserrat leading-relaxed italic"
        >
          "Scent is the most intense form of memory."
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <Link href="/collection">
            <button className="group relative px-14 py-5 bg-transparent border border-white/20 text-white font-montserrat text-[10px] uppercase tracking-[0.6em] font-bold overflow-hidden transition-all duration-500 hover:border-white hover:tracking-[0.8em]">
              <span className="relative z-10">Explore Collection</span>
              {/* Fill Hover Effect */}
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              <style jsx>{`
                button:hover span { color: black; }
              `}</style>
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── MINIMAL SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/20">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
      
      {/* Decorative Frame Border */}
      <div className="absolute inset-0 border-[1px] border-white/5 pointer-events-none m-6 md:m-12" />
    </section>
  )
}
