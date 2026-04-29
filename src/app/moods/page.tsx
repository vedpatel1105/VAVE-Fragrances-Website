"use client"

import { motion } from "framer-motion"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { ProductInfo } from "@/src/data/product-info"
import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, Zap, Heart, Moon, Sun, Coffee, Briefcase } from "lucide-react"

const moodCategories = [
  { name: "Confident", icon: Zap, description: "Command the room with bold, authoritative scents." },
  { name: "Romantic", icon: Heart, description: "Delicate and captivating florals for intimate moments." },
  { name: "Professional", icon: Briefcase, description: "Clean, sophisticated aromas for the modern workspace." },
  { name: "Fresh", icon: Sun, description: "Energizing and crisp notes to start your day." },
  { name: "Mysterious", icon: Moon, description: "Deep, enigmatic blends for the night." },
  { name: "Warm", icon: Coffee, description: "Cozy, gourmand scents that feel like a hug." },
]

export default function MoodsPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const products = useMemo(() => ProductInfo.getAllProductItems(), [])

  const filteredProducts = useMemo(() => {
    if (!selectedMood) return products.filter(p => !p.id.toString().includes('demo'));
    return products.filter(p => p.moods?.includes(selectedMood));
  }, [selectedMood, products])

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black">
      <Navbar setIsCartOpen={() => {}} />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <header className="mb-20">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4 font-mono"
            >
              Olfactory Curation
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif tracking-tight"
            >
              Shop by Mood
            </motion.h1>
          </header>

          {/* Mood Selector Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
            {moodCategories.map((mood) => (
              <button
                key={mood.name}
                onClick={() => setSelectedMood(selectedMood === mood.name ? null : mood.name)}
                className={`flex flex-col items-center justify-center p-6 border transition-all duration-500 ${
                  selectedMood === mood.name 
                    ? "bg-white text-black border-white" 
                    : "bg-white/[0.02] border-white/10 hover:border-white/30"
                }`}
              >
                <mood.icon className={`h-6 w-6 mb-4 ${selectedMood === mood.name ? "text-black" : "text-white/40"}`} strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-widest font-bold">{mood.name}</span>
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="space-y-12">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
               <h3 className="text-[11px] uppercase tracking-[0.3em] font-medium text-white/60">
                 {selectedMood ? `Scents for a ${selectedMood} mood` : "All Curated Fragrances"}
               </h3>
               <span className="text-[10px] font-mono text-white/20">
                 {filteredProducts.length} Results
               </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden mb-6">
                       <Image 
                         src={product.images["30"][0]} 
                         alt={product.name}
                         fill
                         className="object-cover transition-transform duration-1000 group-hover:scale-110"
                       />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <span className="text-[10px] uppercase tracking-[0.4em] font-bold border border-white px-6 py-2">Discover</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xl font-serif">{product.name}</h4>
                        <span className="text-xs font-mono text-white/40">₹{product.price}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30">{product.tagline}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {product.moods?.slice(0, 2).map(m => (
                          <span key={m} className="text-[9px] uppercase tracking-tighter text-white/20 border border-white/10 px-2 py-0.5">{m}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
