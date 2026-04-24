"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  
  // Scroll parallax logic
  const { scrollYProgress } = useScroll()
  const yBottle = useTransform(scrollYProgress, [0, 0.3], ["0%", "10%"])
  const scaleBottle = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])
  const opacityText = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-zinc-950 overflow-hidden flex items-center justify-center"
      style={{ isolation: "isolate" }}
    >
      {/* LAYER 1: Ambient Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-zinc-800/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-zinc-800/5 blur-[120px] rounded-full" />
      </div>

      {/* LAYER 2: The Bottle (Centerpiece) */}
      <motion.div
        style={{ 
          y: yBottle,
          scale: scaleBottle,
        }}
        className="relative z-10 w-[260px] sm:w-[380px] md:w-[480px] lg:w-[550px] aspect-square flex items-center justify-center transition-all duration-700"
      >
        <Image
          src="/luxury_fragrance_hero_bottle_1776588172585.png"
          alt="Vave Luxury Fragrance"
          fill
          priority
          className="object-contain drop-shadow-[0_15px_50px_rgba(0,0,0,0.4)]"
        />
      </motion.div>

      {/* LAYER 3: Foreground Typography */}
      <motion.div
        style={{ opacity: opacityText }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-center"
      >
        <div className="flex flex-col items-center pointer-events-auto w-full max-w-[90%] md:max-w-2xl px-6 pt-[40vh] md:pt-[45vh]">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.2, delay: 0.2 }}
             className="mb-6"
          >
            <span className="text-[8px] md:text-[10px] uppercase text-white/30 font-montserrat tracking-[0.8em]">
              VAVE — Extraits De Parfum
            </span>
          </motion.div>

          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair text-white leading-[1.1] tracking-tight uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl"
            >
              Discover Your <br />
              <span className="italic opacity-60 font-serif lowercase">Signature Scent</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="text-white/20 text-[11px] md:text-[14px] font-light max-w-sm mb-12 font-montserrat leading-relaxed"
          >
            Luxury perfumes crafted for those who understand that true excellence never announces itself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="/collection">
              <button className="group relative px-12 md:px-16 py-5 bg-white text-black font-montserrat text-[10px] uppercase tracking-[0.5em] font-bold overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-zinc-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-24 md:bottom-12 flex flex-col items-center gap-4 text-white/10"
      >
        <span className="text-[7px] uppercase tracking-[0.6em] font-montserrat">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="h-8 w-px bg-white/20" />
      </motion.div>

      <div className="absolute inset-0 border-[1px] border-white/5 pointer-events-none m-6 md:m-12" />
    </section>
  )
}
