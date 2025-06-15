"use client"

import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import Footer from "@/src/app/components/Footer"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SimpleNavbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="flex items-center text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-accent">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Sustainability</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-8">Our Commitment to Sustainability</h1>
          
          <div className="space-y-12">
            <section className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Eco-Friendly Packaging</h2>
              <ul className="list-disc pl-6 space-y-4">
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

            <section className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Artisanal Production</h2>
              <ul className="list-disc pl-6 space-y-4">
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

            <section className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Quality Ingredients</h2>
              <ul className="list-disc pl-6 space-y-4">
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
      </main>

      <Footer />
    </div>
  )
}
