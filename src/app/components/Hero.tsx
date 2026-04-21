"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  
  // Mouse tracking for interaction
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 30, stiffness: 100 }

  // 3D Tilt logic
  const rawRotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7])
  const rawRotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7])
  const rotateX = useSpring(rawRotateX, springConfig)
  const rotateY = useSpring(rawRotateY, springConfig)

  // Scroll parallax logic
  const { scrollYProgress } = useScroll()
  const yBottle = useTransform(scrollYProgress, [0, 0.3], ["0%", "15%"])
  const scaleBottle = useTransform(scrollYProgress, [0, 0.3], [0.95, 1.1])
  const opacityText = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const bgTextY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-20%"])
  const lightOpacity = useTransform(scrollYProgress, [0, 0.2], [0.4, 0.1])

  // Interactive light effects
  const lightRotateX = useTransform(rotateX, (v) => (typeof v === 'number' ? -v * 0.5 : 0))
  const lightRotateY = useTransform(rotateY, (v) => (typeof v === 'number' ? -v * 0.5 : 0))
  
  const rawLightLeakX = useTransform(mouseX, [-0.5, 0.5], [-300, 300])
  const rawLightLeakY = useTransform(mouseY, [-0.5, 0.5], [-300, 300])
  const lightLeakX = useSpring(rawLightLeakX, springConfig)
  const lightLeakY = useSpring(rawLightLeakY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-zinc-950 overflow-hidden flex items-center justify-center cursor-default"
      style={{ isolation: "isolate" }}
    >
      {/* LAYER 1: Background Branding */}
      <motion.div
        style={{ y: bgTextY }}
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.03]"
      >
        <span className="font-playfair text-[40vw] font-bold leading-none uppercase text-white tracking-[0.1em]">
          VAVE
        </span>
      </motion.div>

      {/* LAYER 2: Ambient Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-zinc-800/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-zinc-800/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[#000] opacity-[0.02] pointer-events-none mix-blend-overlay" />
      </div>

      {/* LAYER 3: The Bottle (Centerpiece) */}
    

      {/* LAYER 4: Foreground Typography */}
      <motion.div
        style={{ opacity: opacityText }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-center"
      >
        <div className="mt-[20vh] md:mt-[25vh] lg:mt-[30vh] flex flex-col items-center pointer-events-auto">
          <motion.div
             initial={{ opacity: 0, letterSpacing: "0.5em" }}
             animate={{ opacity: 1, letterSpacing: "1em" }}
             transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
             className="mb-8"
          >
            <span className="text-[9px] md:text-[11px] uppercase text-white/40 font-montserrat">
              VAVE FRAGRANCES
            </span>
          </motion.div>

          <div className="overflow-hidden mb-12">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair text-white leading-[0.95] tracking-tight uppercase text-5xl md:text-7xl lg:text-8xl"
            >
              Discover Your <br />
              <span className="italic opacity-60 font-serif">Signature Scent.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="text-white/30 text-[12px] md:text-[14px] font-light max-w-sm mb-12 font-montserrat leading-relaxed px-6"
          >
            Crafted for those who understand that true luxury never announces itself — it lingers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="flex flex-col items-center gap-8"
          >
            <Link href="/collection">
              <button className="group relative px-12 py-5 bg-white text-black font-montserrat text-[10px] uppercase tracking-[0.5em] font-bold overflow-hidden transition-all duration-700 hover:px-16">
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-zinc-200 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* LAYER 5: Bottom Details & Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.8 }}
        className="absolute bottom-12 inset-x-0 px-8 flex justify-between items-end pointer-events-none"
      >
        <div className="hidden md:block">
          <p className="text-[7px] uppercase tracking-widest text-white/20 mb-2">Heritage</p>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-montserrat">Artisan Grafting</p>
        </div>

        <div className="flex flex-col items-center gap-4 text-white/20 absolute left-1/2 -translate-x-1/2">
           <span className="text-[7px] uppercase tracking-[0.6em] font-montserrat">Scroll to Begin</span>
           <motion.div
             animate={{ y: [0, 6, 0] }}
             transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
           >
             <ChevronDown size={14} strokeWidth={1} />
           </motion.div>
        </div>

        <div className="hidden md:block text-right">
          <p className="text-[7px] uppercase tracking-widest text-white/20 mb-2">Molecular</p>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-montserrat">Pure Extraction</p>
        </div>
      </motion.div>

      {/* LAYER 6: Interactive Light Leak */}
      <motion.div 
        style={{
          x: lightLeakX,
          y: lightLeakY,
          opacity: lightOpacity
        }}
        className="absolute inset-0 z-0 blur-[180px] pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full" />
      </motion.div>

      <div className="absolute inset-0 border-[1px] border-white/5 pointer-events-none m-4 md:m-8" />
    </section>
  )
}
