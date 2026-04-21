"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Layers, Palette, Zap, ArrowRight, FlaskConical } from "lucide-react"
import Link from "next/link"
import { ProductInfo } from "@/src/data/product-info"

const layeringSteps = [
  {
    step: "01",
    title: "Main Scent",
    description: "Choose your first perfume as the base.",
    details: "This provides the strong foundation for your mix. Typically a woody or amber scent works best as a base.",
    icon: <Layers className="h-6 w-6" strokeWidth={1} />,
    color: "from-amber-500/20 to-transparent"
  },
  {
    step: "02", 
    title: "Matching Scent",
    description: "Add a second perfume to create a new smell.",
    details: "Layer a fresh or floral scent on top to add brightness and new dimensions to your foundation.",
    icon: <Palette className="h-6 w-6" strokeWidth={1} />,
    color: "from-blue-500/20 to-transparent"
  },
  {
    step: "03",
    title: "Final Mix",
    description: "Watch the perfumes blend into your own scent.",
    details: "The two scents merge on your skin to create a unique third fragrance that is yours alone.",
    icon: <Sparkles className="h-6 w-6" strokeWidth={1} />,
    color: "from-purple-500/20 to-transparent"
  }
]

function FusionVisual() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Liquid Circles */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 10, 0],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-white/5 rounded-full blur-3xl"
      />
      
      <motion.div 
        animate={{ 
          x: [-20, 20, -20],
          y: [-10, 10, -10]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl mix-blend-screen"
      />
      
      <motion.div 
        animate={{ 
          x: [20, -20, 20],
          y: [10, -10, 10]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl mix-blend-screen"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <FlaskConical className="w-16 h-16 text-white/10" strokeWidth={0.5} />
      </div>
    </div>
  )
}

export default function CompactLayeringAwareness() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const popularCombinations = ProductInfo.popularCombinations.slice(0, 3)

  return (
    <section className="w-full py-40 relative bg-zinc-950 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          
          {/* Left Side: Visual & Context */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-amber-500/60 mb-6 bg-white/5 w-max px-4 py-2 border border-white/5">
                <FlaskConical className="h-3 w-3" />
                <span>Infinite Possibilities</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 tracking-tight leading-[1.1]">
                Master the Art of <br />
                <span className="italic text-white/60">Molecular Layering</span>
              </h2>
              <p className="text-white/40 max-w-lg font-light leading-relaxed text-base mb-10">
                Indian fragrances are known for their depth. We take it further: Blend any two of our 8 perfumes to create a scent that is unique to you. Over 64 possible combinations.
              </p>
              
              <div className="hidden lg:block">
                <FusionVisual />
              </div>
            </motion.div>
          </div>

          {/* Right Side: Interactive Steps */}
          <div className="space-y-6">
            {layeringSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
                className={`relative p-8 border transition-all duration-500 cursor-pointer overflow-hidden group ${
                  activeStep === index ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5'
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                
                <div className="flex items-start gap-8 relative z-10">
                  <div className={`flex flex-col items-center transition-colors duration-500 ${activeStep === index ? 'text-white' : 'text-white/20'}`}>
                    <span className="text-xs font-mono font-bold mb-4 tracking-tighter">{step.step}</span>
                    <div className="w-px h-12 bg-current opacity-20" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-full border transition-all duration-500 ${
                        activeStep === index ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10'
                      }`}>
                        {step.icon}
                      </div>
                      <h4 className="text-xl font-serif text-white tracking-wide">{step.title}</h4>
                    </div>
                    
                    <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-4">
                      {step.description}
                    </p>
                    
                    <motion.div
                      animate={{ height: activeStep === index ? 'auto' : 0, opacity: activeStep === index ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-white/20 text-xs leading-relaxed border-t border-white/5 pt-4 font-light">
                        {step.details}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Popular Combinations - Glassmorphism Grid */}
        <div className="mt-32 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2">Popular Pairings</h4>
              <h5 className="text-3xl font-serif text-white italic">Tried & Tested</h5>
            </div>
            <Link href="/layering">
              <Button variant="link" className="text-white/40 hover:text-white p-0 h-auto text-[10px] uppercase tracking-widest">
                Explore All Mixes <ArrowRight className="ml-2 w-3 h-3" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCombinations.map((combo, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="group p-8 bg-white/5 border border-white/5 relative overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -rotate-45 translate-x-12 translate-y-[-12px]" />
                
                <h5 className="text-xl font-serif text-white mb-6 relative z-10 flex items-center gap-3">
                  {combo.name}
                  <span className="text-[8px] font-mono py-0.5 px-2 bg-white/10 text-white/60">MATCH {combo.popularity}</span>
                </h5>
                
                <div className="flex items-center gap-4 text-white/30 mb-8 relative z-10 transition-colors group-hover:text-white/60">
                   <div className="flex flex-col gap-1 items-center">
                     <span className="text-[9px] uppercase tracking-widest">{combo.fragrance1}</span>
                   </div>
                   <div className="w-8 h-px bg-white/10" />
                   <div className="flex flex-col gap-1 items-center">
                     <span className="text-[9px] uppercase tracking-widest">{combo.fragrance2}</span>
                   </div>
                </div>

                <Link href={`/layering?base=${combo.fragrance1}&accent=${combo.fragrance2}`}>
                  <button className="w-full py-4 border border-white/10 text-[9px] uppercase tracking-[0.3em] font-bold text-white/40 hover:bg-white hover:text-black hover:border-white transition-all duration-500">
                    Test This Mix
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


