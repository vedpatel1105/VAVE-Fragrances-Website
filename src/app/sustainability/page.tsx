"use client"

import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import Footer from "@/src/app/components/Footer"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

export default function SustainabilityPage() {
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
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Our Commitment</h2>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide">Sustainability</h1>
          </div>
          
          <div className="space-y-12 text-white/60 font-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-serif text-white tracking-wide mb-4">Eco-Friendly Packaging</h2>
              <ul className="list-disc marker:text-white/30 pl-6 space-y-4">
                <li>
                  Our premium glass bottles are both luxurious and fully recyclable, designed to minimize 
                  environmental impact while maintaining aesthetic appeal.
                </li>
                <li>
                  We use minimal, plastic-free packaging made from recycled cardboard and paper materials, 
                  reducing waste and promoting circular economy.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-white tracking-wide mb-4">Artisanal Production</h2>
              <ul className="list-disc marker:text-white/30 pl-6 space-y-4">
                <li>
                  Our fragrances are hand-crafted by skilled artisans, maintaining traditional perfumery 
                  methods that preserve quality while reducing energy consumption.
                </li>
                <li>
                  By choosing manual craftsmanship over industrial machinery, we create meaningful 
                  employment opportunities and ensure each fragrance receives personal attention.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-white tracking-wide mb-4">Quality Ingredients</h2>
              <ul className="list-disc marker:text-white/30 pl-6 space-y-4">
                <li>
                  We source high-quality, pure ingredients from responsible suppliers who share our 
                  commitment to sustainability.
                </li>
                <li>
                  Our ingredients are carefully selected to ensure both quality and environmental 
                  responsibility, with a focus on sustainable harvesting practices.
                </li>
                <li>
                  While we prioritize natural ingredients, we maintain transparency about our use of 
                  safe synthetic components when necessary for fragrance stability and longevity.
                </li>
              </ul>
            </section>

           

            <div className="text-center my-12">
              <p className="font-serif text-xl italic">
                "We don't inherit the Earth from our ancestors; we borrow it from our children."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
