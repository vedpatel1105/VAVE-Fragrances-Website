"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

export default function BoutiqueHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use window scroll (no ref needed) — safe across hydration states
  const { scrollYProgress } = useScroll()

  const yImage = useTransform(scrollYProgress, [0, 0.3], ["0%", "12%"])
  const fadeOut = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  if (!mounted) {
    return <div className="w-full h-screen bg-black" />
  }

  return (
    <section
      id="vave-hero-2026"
      className="relative w-full h-screen bg-black overflow-hidden flex"
      style={{ isolation: "isolate" }}
    >
      {/* ─── LEFT: Typography Panel ─── */}
      <motion.div
        style={{ opacity: fadeOut }}
        className="relative z-20 w-full md:w-[52%] h-full flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-24 bg-black"
      >
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="block text-[9px] md:text-[10px] uppercase tracking-[0.85em] text-white/30 mb-8 font-montserrat"
        >
          Vave — Extraits De Parfum
        </motion.span>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-playfair text-white leading-[0.9] tracking-[-0.02em] uppercase mb-10"
          style={{ fontSize: "clamp(2.8rem, 6.5vw, 7rem)" }}
        >
          Discover<br />
          Your<br />
          Signature<br />
          <em className="not-italic italic opacity-70">Scent.</em>
        </motion.h1>

        {/* Sub-line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-white/35 text-[13px] md:text-[14px] font-light leading-relaxed max-w-xs mb-12 font-montserrat"
        >
          Each bottle is a study in restraint — crafted for those who understand that true luxury never announces itself.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Link href="/collection">
            <button className="group flex items-center gap-5">
              <span className="text-[10px] uppercase tracking-[0.6em] text-white font-bold font-montserrat group-hover:text-white/60 transition-colors duration-500">
                Explore Collection
              </span>
              <span className="block h-px w-10 bg-white/30 group-hover:w-16 group-hover:bg-white/60 transition-all duration-700" />
            </button>
          </Link>
        </motion.div>

        {/* Bottom detail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="absolute bottom-10 left-8 sm:left-12 md:left-16 lg:left-24 flex gap-8"
        >
          <div>
            <p className="text-[7px] uppercase tracking-widest text-white/20 mb-1">Extraction</p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-montserrat">Molecular Purity</p>
          </div>
          <div className="w-px h-8 bg-white/10 self-center" />
          <div>
            <p className="text-[7px] uppercase tracking-widest text-white/20 mb-1">Heritage</p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-montserrat">Artisan Grafting</p>
          </div>
        </motion.div>
      </motion.div>

      {/* ─── RIGHT: Boutique Image Panel ─── */}
      <div className="hidden md:block md:w-[48%] h-full relative overflow-hidden">
        {/* Edge bleed into left black */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />

        <motion.div style={{ y: yImage }} className="relative w-full h-[115%] -top-[7.5%]">
          <Image
            src="/vave-boutique-hero.png"
            alt="Vave Luxury Boutique — Signature Fragrance Bottles"
            fill
            priority
            className="object-cover object-center"
            sizes="50vw"
          />
          {/* Subtle dark overlay to soften */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </div>

      {/* Mobile full-bleed background (only on small screens) */}
      <div className="absolute inset-0 md:hidden z-0">
        <Image
          src="/vave-boutique-hero.png"
          alt="Vave Luxury Boutique"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}
