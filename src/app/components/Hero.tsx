"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function Hero() {
  const ref = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Cinematic Parallax & Scale
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      
      {/* Signature Atmospheric Background */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 z-0 w-full h-full overflow-hidden"
      >
        {/* Animated Shadow Voids */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.2, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/4 -left-1/4 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-transparent to-transparent blur-[150px]"
          />
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1.2, 1, 1.2],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent blur-[150px]"
          />
        </div>

        {/* High-End Noise Grain */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay scale-150" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </motion.div>

      {/* Frame / Border Structure */}
      <div className="absolute inset-0 border-[1px] border-white/5 pointer-events-none z-10 m-8 md:m-12" />

      {/* Content Interface */}
      <motion.div 
        style={{ opacity: opacityText, scale: scaleText }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.6em" }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[9px] md:text-[10px] uppercase text-white/40 mb-12 font-mono"
        >
          Vave High Fragrance
        </motion.div>

        <h1 className="flex flex-col items-center gap-4 mb-16">
           <div className="overflow-hidden">
             <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="block text-6xl md:text-8xl lg:text-[9rem] font-serif text-white leading-none tracking-tight"
             >
                Modern
             </motion.span>
           </div>
           <div className="overflow-hidden">
             <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                className="block text-6xl md:text-8xl lg:text-[9rem] font-serif text-white/20 italic leading-none tracking-tight"
             >
                Obsession
             </motion.span>
           </div>
        </h1>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/collection">
            <button className="group relative px-12 py-5 bg-transparent overflow-hidden">
               <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors duration-500" />
               <motion.div 
                 className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.22,1,0.36,1]"
               />
               <span className="relative text-[10px] uppercase tracking-[0.4em] text-white font-bold group-hover:text-white transition-colors">
                 Observe Collection
               </span>
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Vertical Navigation Bar Look */}
      <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-12 items-center z-10">
         <div className="w-px h-24 bg-gradient-to-t from-white/20 to-transparent" />
         <span className="text-[8px] uppercase tracking-[0.3em] rotate-180 [writing-mode:vertical-lr] text-white/20">The New Standard</span>
      </div>

      {/* Scroll Trigger Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-10"
      >
        <div className="w-px h-16 bg-white/10 relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
          />
        </div>
      </motion.div>
    </section>
  )
}
