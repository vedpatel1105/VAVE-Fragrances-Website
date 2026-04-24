"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }
  
  // Immersive Parallax & Spotlight Physics
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const contentY = useTransform(scrollYProgress, [0, 0.2], [0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const spotlightX = useSpring(mouseX, { damping: 30, stiffness: 150 })
  const spotlightY = useSpring(mouseY, { damping: 30, stiffness: 150 })

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center px-6 selection:bg-white selection:text-black"
    >
      {/* ── ARCHITECTURAL BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Animated Ghost Logo with Parallax */}
        <motion.div 
          style={{ y: backgroundY }}
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <motion.span 
            animate={{ opacity: [0.03, 0.05, 0.03] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="font-playfair text-[40vw] font-black leading-none uppercase tracking-[-0.05em] text-white select-none pointer-events-none whitespace-nowrap"
          >
            VAVE
          </motion.span>
        </motion.div>

        {/* Multi-layered Technical Grid */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        <div className="absolute inset-0 opacity-[0.01]" 
             style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>

      {/* ── CENTERED SIGNATURE CONTENT ── */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center"
      >
        {/* Orbiting 'Discovery' Orb */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] pointer-events-none"
        >
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full blur-[2px]" 
          />
        </motion.div>

        {/* Modern Label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8 md:mb-12 flex items-center gap-6"
        >
          <div className="h-px w-8 bg-white/20" />
          <span className="text-[9px] md:text-[10px] uppercase tracking-[1em] text-white/40 font-montserrat">
           VAVE FRAGRANCES
          </span>
          <div className="h-px w-8 bg-white/20" />
        </motion.div>

        {/* REFINED HEADING WITH SPOTLIGHT MASK */}
        <div className="relative mb-12 md:mb-16 group">
          {/* Spotlight Mask Effect */}
          <motion.div 
            style={{ x: spotlightX, y: spotlightY }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/[0.15] blur-[80px] rounded-full mix-blend-overlay pointer-events-none z-20"
          />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-playfair text-white leading-tight uppercase flex flex-col gap-1 md:gap-2"
          >
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter">
              Discover Your
            </span>
            <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl italic font-serif lowercase text-transparent bg-clip-text bg-gradient-to-r from-white/80 via-white via-white/40 via-white to-white/80 bg-[length:300%_auto] animate-liquid-shimmer">
              Signature Scent
            </span>
          </motion.h1>

          <style jsx>{`
            @keyframes liquid {
              0% { background-position: 300% center; }
              100% { background-position: -300% center; }
            }
            .animate-liquid-shimmer {
              animation: liquid 15s linear infinite;
            }
          `}</style>
        </div>

        {/* Action Button: Liquid Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Link href="/collection">
            <button className="group relative px-14 md:px-20 py-4 md:py-6 border border-white/20 bg-transparent text-white font-montserrat text-[10px] md:text-[11px] font-black uppercase tracking-[1em] overflow-hidden transition-all duration-700 hover:border-white">
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">Shop Now</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── TECHNICAL CORNER DETAILS ── */}
      <div className="absolute top-12 left-12 hidden lg:flex flex-col gap-2 opacity-20">
        <div className="h-px w-8 bg-white" />
        <span className="text-[7px] uppercase tracking-widest font-black">48.8566° N, 2.3522° E</span>
      </div>

      <div className="absolute bottom-12 inset-x-12 flex justify-between items-end">
        <div className="hidden md:flex flex-col gap-1 text-white/10">
          <span className="text-[7px] uppercase tracking-widest">Extrait De Parfum</span>
          <div className="h-[2px] w-12 bg-white/20 mt-1" />
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <span className="text-[8px] uppercase tracking-[0.8em] text-white/10 font-montserrat">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent"
          />
        </div>

        <div className="hidden md:flex flex-col gap-1 text-white/10 text-right">
          <span className="text-[7px] uppercase tracking-widest">Maison Vave</span>
          <div className="h-[2px] w-12 bg-white/20 mt-1 ml-auto" />
        </div>
      </div>
    </section>
  )
}
