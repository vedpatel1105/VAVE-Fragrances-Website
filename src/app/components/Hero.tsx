"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

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
        >
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
            Explore Collection
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
