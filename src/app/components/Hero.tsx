"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Layers, Search, ArrowRight, BookOpen, Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-hero bg-cover bg-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 md:px-6 relative z-10 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-serif"
        >
          Discover Your Signature Scent
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-cormorant"
        >
          Indulge in our collection of exquisite fragrances, crafted to elevate your senses and leave a lasting
          impression.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col gap-6 justify-center items-center"
        >
          {/* Primary CTA */}
          <Link href="/collection">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white text-black hover:bg-gray-200 transition-all duration-300 cursor-pointer px-8 py-4 rounded-full text-lg font-semibold"
            >
              <BookOpen className="h-5 w-5" />
              <span>Explore Our Collection</span>
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Link>

          {/* Secondary Features */}
          <div className="hidden sm:flex sm:flex-row gap-4">
            <Link href="/scent-finder">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm font-medium">Find Your Scent</span>
                <ArrowRight className="h-3 w-3" />
              </motion.div>
            </Link>

            <Link href="/layering">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <Layers className="h-4 w-4" />
                <span className="text-sm font-medium">Try Layering</span>
                <ArrowRight className="h-3 w-3" />
              </motion.div>
            </Link>

            <a href="#featured">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Featured Fragrances</span>
                <ArrowRight className="h-3 w-3" />
              </motion.div>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
