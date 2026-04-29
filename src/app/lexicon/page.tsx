"use client"

import { motion } from "framer-motion"
import Navbar from "@/src/app/components/Navbar"
import Footer from "@/src/app/components/Footer"
import { Search, BookOpen, Sparkles, Wind, Droplets, Clock } from "lucide-react"
import { useState } from "react"

const lexiconTerms = [
  {
    term: "Sillage",
    phonetic: "/siːˈjɑːʒ/",
    definition: "The trail of scent left by a perfume as it evaporates from the skin. A fragrance with 'strong sillage' can be detected from a distance.",
    icon: Wind,
  },
  {
    term: "Notes",
    phonetic: "/noʊts/",
    definition: "The individual 'ingredients' or scents that make up a perfume. They are divided into Top, Heart, and Base notes.",
    icon: Music,
  },
  {
    term: "Longevity",
    phonetic: "/lɒnˈdʒɛvɪti/",
    definition: "How long a fragrance lasts on your skin before it completely disappears. Vave fragrances are engineered for 8-12 hours of longevity.",
    icon: Clock,
  },
  {
    term: "Oud",
    phonetic: "/uːd/",
    definition: "One of the most expensive raw materials in the world. It is a resinous heartwood from the Aquilaria tree, known for its deep, woody, and complex aroma.",
    icon: Sparkles,
  },
  {
    term: "Decant",
    phonetic: "/ˈdiːkænt/",
    definition: "The process of transferring perfume from its original bottle into a smaller container. Ideal for traveling or sampling.",
    icon: Droplets,
  },
  {
    term: "Dry Down",
    phonetic: "/draɪ daʊn/",
    definition: "The final phase of a fragrance's life on the skin, occurring after the top and heart notes have evaporated, leaving only the base notes.",
    icon: BookOpen,
  },
  {
    term: "Eau de Parfum (EDP)",
    phonetic: "/oʊ də pɑːrˈfæm/",
    definition: "A concentration of fragrance oil (typically 15-20%). Vave utilizes a high-concentration EDP formula (25%) for maximum impact.",
    icon: Droplets,
  },
  {
    term: "Gourmand",
    phonetic: "/ˈɡʊərmɑːnd/",
    definition: "A fragrance category that features 'edible' notes like vanilla, chocolate, honey, or coffee. Think of our 'Velora' scent.",
    icon: Sparkles,
  }
]

import { Music } from "lucide-react"

export default function LexiconPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTerms = lexiconTerms.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black">
      <Navbar setIsCartOpen={() => {}} />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <header className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight">The Lexicon</h1>
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/40 max-w-xl mx-auto leading-relaxed">
                Master the language of scent. A curated guide to the world of high-end perfumery by Vave Fragrances.
              </p>
            </motion.div>
          </header>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-20 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH THE GLOSSARY..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-none h-16 pl-14 pr-6 text-[10px] uppercase tracking-widest focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Glossary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {filteredTerms.map((item, index) => (
              <motion.div
                key={item.term}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-950 p-10 group hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-serif mb-1 group-hover:translate-x-2 transition-transform duration-500">{item.term}</h3>
                    <span className="text-[10px] font-mono text-white/30 tracking-widest italic">{item.phonetic}</span>
                  </div>
                  <item.icon className="h-5 w-5 text-white/10 group-hover:text-white group-hover:rotate-12 transition-all duration-500" strokeWidth={1} />
                </div>
                <p className="text-sm text-white/50 leading-relaxed font-light tracking-wide">
                  {item.definition}
                </p>
              </motion.div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/20">No terms match your search</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
