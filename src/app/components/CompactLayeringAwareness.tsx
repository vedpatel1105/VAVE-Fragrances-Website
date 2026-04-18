"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Layers, Palette, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ProductInfo } from "@/src/data/product-info"

const layeringSteps = [
  {
    step: "01",
    title: "Base Foundation",
    description: "Select your primary fragrance as the deep foundation.",
    icon: <Layers className="h-5 w-5" strokeWidth={1.5} />,
  },
  {
    step: "02", 
    title: "Secondary Accent",
    description: "Layer a complementary scent above to elevate notes.",
    icon: <Palette className="h-5 w-5" strokeWidth={1.5} />,
  },
  {
    step: "03",
    title: "Scent Alchemy",
    description: "Watch the oils merge into your bespoke signature.",
    icon: <Sparkles className="h-5 w-5" strokeWidth={1.5} />,
  }
]

export default function CompactLayeringAwareness() {
  const popularCombinations = ProductInfo.popularCombinations.slice(0, 3)

  return (
    <section className="w-full py-32 relative bg-zinc-950 overflow-hidden">
      {/* Structural Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-white/20 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24 relative"
          >
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-mono">Bespoke Experience</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">The Art of Layering</h3>
            <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-sm mb-8">
              Experience our extraordinary USP: Blend any two of our 8 signature Extraits de Parfum to craft over 64 bespoke olfactory signatures. Not just mixing—pure scent alchemy.
            </p>
            <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest text-white/50 border border-white/10 w-max mx-auto px-6 py-2 rounded-full bg-white/5">
              <Zap className="h-3 w-3" strokeWidth={1.5} />
              <span>Our Unique Selling Proposition</span>
            </div>
          </motion.div>

          {/* How It Works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {layeringSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative group"
              >
                <div className="h-full bg-zinc-950 border border-white/5 p-10 flex flex-col items-center text-center transition-all duration-500 hover:border-white/20 hover:bg-zinc-900/40">
                  <span className="absolute top-6 left-6 text-xs font-mono text-white/10 font-bold tracking-tighter">{step.step}</span>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 text-white/60 border border-white/10 group-hover:scale-110 group-hover:text-white group-hover:border-white/30 transition-all duration-500">
                    {step.icon}
                  </div>
                  <h4 className="text-lg font-serif text-white mb-3 tracking-wide">{step.title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed font-light">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Popular Combinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-20"
          >
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/40 text-center mb-10">Cult Favorites</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularCombinations.map((combo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-transparent border border-white/5 rounded-none p-6 text-center hover:bg-white/5 hover:border-white/10 transition-all duration-500 flex flex-col items-center justify-center"
                >
                  <h5 className="text-lg font-serif text-white mb-1 tracking-wide">{combo.name}</h5>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
                    {combo.fragrance1} <span className="mx-2 text-white/20">+</span> {combo.fragrance2}
                  </p>
                  <div className="inline-block px-3 py-1 bg-white border border-transparent text-black text-[9px] uppercase tracking-widest font-bold">
                    {combo.popularity} Match
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center flex flex-col items-center"
          >
            <Link href="/layering">
              <Button className="bg-transparent text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-500 px-10 py-7 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold group">
                <Layers className="h-4 w-4 mr-3" strokeWidth={1.5} />
                Try Layering Concept
                <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-2 transition-transform" strokeWidth={1.5} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

