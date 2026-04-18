"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import Footer from "@/src/app/components/Footer"

export default function CraftsmanshipPage() {
  return (
    <main className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-white/20">
      <SimpleNavbar />
      <div className="flex-grow pt-32 pb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5 }}
           className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Behind The Scenes</h2>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">Our Craftsmanship</h1>
          </div>
          <div className="space-y-12 text-white/60 font-light leading-relaxed">

         
            <h2 className="text-2xl font-serif text-white tracking-wide mb-4">Our Process</h2>
            <p>
              Creating a VAVE fragrance is a journey that can take anywhere from six months to two years. Our process
              combines traditional perfumery techniques with cutting-edge technology to ensure consistency and
              excellence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-6 rounded-lg text-center hover:bg-white/5 transition-all duration-500">
                <h4 className="font-serif text-lg text-white mb-2 tracking-wide">1. Concept Development</h4>
                <p className="text-sm">
                  Every fragrance begins with an idea—a mood, a memory, or an emotion we want to capture and express
                  through scent.
                </p>
              </div>
              <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-6 rounded-lg text-center hover:bg-white/5 transition-all duration-500">
                <h4 className="font-serif text-lg text-white mb-2 tracking-wide">2. Formula Creation</h4>
                <p className="text-sm">
                  Our perfumers create multiple iterations, carefully balancing top, heart, and base notes to achieve
                  the perfect composition.
                </p>
              </div>
              <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-6 rounded-lg text-center hover:bg-white/5 transition-all duration-500">
                <h4 className="font-serif text-lg text-white mb-2 tracking-wide">3. Maturation & Testing</h4>
                <p className="text-sm">
                  Each batch is allowed to mature for several weeks, during which we conduct rigorous testing for
                  quality and consistency.
                </p>
              </div>
            </div>

            <Separator className="my-12" />

            <h2 className="text-2xl font-serif text-white tracking-wide mb-4">Master Perfumers</h2>
            <p>
              Our team of master perfumers brings decades of experience and an uncompromising commitment to excellence.
              They understand that fragrance is deeply personal and work tirelessly to create scents that resonate with
              our customers on an emotional level.
            </p>

            <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-8 rounded-lg my-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <blockquote className="text-xl italic text-center">
                "A great fragrance is like a piece of music—it has rhythm, harmony, and the power to transport you to
                another place and time."
              </blockquote>
              <p className="text-center mt-4 font-serif">— Master Perfumer, VAVE Fragrances</p>
            </div>

            <h2 className="text-2xl font-serif text-white tracking-wide mb-4">Quality Assurance</h2>
            <p>
              Quality is never compromised at VAVE. Every bottle that leaves our facility has undergone extensive
              testing to ensure it meets our exacting standards. From the concentration of the fragrance oil to the
              clarity of the liquid, every detail is scrutinized.
            </p>

            <ul className="list-disc marker:text-white/30 pl-6 mb-4 space-y-2">
              <li>
                <strong className="text-white font-medium">Batch Testing</strong> - Every batch is tested for consistency and quality
              </li>
              <li>
                <strong className="text-white font-medium">Stability Testing</strong> - Fragrances are tested under various conditions
              </li>
              <li>
                <strong className="text-white font-medium">Sensory Evaluation</strong> - Expert panels evaluate each fragrance
              </li>
              <li>
                <strong className="text-white font-medium">Final Inspection</strong> - Visual and olfactory inspection before packaging
              </li>
            </ul>

            <div className="text-center my-12">
              <p className="font-serif text-xl italic">
                "Craftsmanship is our commitment to creating fragrances that are not just beautiful, but unforgettable."
              </p>
            </div>
      
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
