"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Layers, Palette, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ProductInfo } from "@/src/data/product-info"

const layeringSteps = [
  {
    step: "1",
    title: "Choose Your Base",
    description: "Select your primary fragrance as the foundation",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    step: "2", 
    title: "Add Your Accent",
    description: "Pick a complementary scent to layer on top",
    icon: <Palette className="h-5 w-5" />,
  },
  {
    step: "3",
    title: "Create Magic",
    description: "Watch as the scents blend into something uniquely yours",
    icon: <Sparkles className="h-5 w-5" />,
  }
]

export default function CompactLayeringAwareness() {
  const [selectedFragrance1, setSelectedFragrance1] = useState<any>(null)
  const [selectedFragrance2, setSelectedFragrance2] = useState<any>(null)

  const popularCombinations = ProductInfo.popularCombinations.slice(0, 3)

  return (
    <section className="w-full py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
              The Art of Layering
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              Our unique USP: Combine any two of our 8 signature fragrances to create up to 64 unique scent combinations. 
              This isn't just mixing perfumes—it's creating your personal olfactory signature.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <Zap className="h-4 w-4" />
              <span>Our Unique Selling Point</span>
            </div>
          </motion.div>

          {/* How It Works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {layeringSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {step.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{step.step}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Popular Combinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
            <h3 className="text-xl font-semibold text-white text-center mb-6">Popular Combinations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularCombinations.map((combo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:bg-gray-800/70 transition-all duration-300"
                >
                  <h4 className="text-white font-semibold mb-2">{combo.name}</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    {combo.fragrance1} + {combo.fragrance2}
                  </p>
                  <div className="text-white text-sm font-medium">
                    {combo.popularity} Popular
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
            className="text-center"
          >
            <Link href="/layering">
              <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full text-lg font-semibold">
                <Layers className="h-5 w-5 mr-2" />
                Try Layering Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <p className="text-gray-400 text-sm mt-3">
              Create your unique scent combination in just 3 simple steps
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
