"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import Footer from "@/src/app/components/Footer"

export default function CraftsmanshipPage() {
  return (
    <>
      <SimpleNavbar  />
      <main className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-8">Our Craftsmanship</h1>

         
            <h2>Our Process</h2>
            <p>
              Creating a VAVE fragrance is a journey that can take anywhere from six months to two years. Our process
              combines traditional perfumery techniques with cutting-edge technology to ensure consistency and
              excellence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="font-bold mb-2">1. Concept Development</h4>
                <p className="text-sm">
                  Every fragrance begins with an idea—a mood, a memory, or an emotion we want to capture and express
                  through scent.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="font-bold mb-2">2. Formula Creation</h4>
                <p className="text-sm">
                  Our perfumers create multiple iterations, carefully balancing top, heart, and base notes to achieve
                  the perfect composition.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="font-bold mb-2">3. Maturation & Testing</h4>
                <p className="text-sm">
                  Each batch is allowed to mature for several weeks, during which we conduct rigorous testing for
                  quality and consistency.
                </p>
              </div>
            </div>

            <Separator className="my-12" />

            <h2>Master Perfumers</h2>
            <p>
              Our team of master perfumers brings decades of experience and an uncompromising commitment to excellence.
              They understand that fragrance is deeply personal and work tirelessly to create scents that resonate with
              our customers on an emotional level.
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg my-8">
              <blockquote className="text-xl italic text-center">
                "A great fragrance is like a piece of music—it has rhythm, harmony, and the power to transport you to
                another place and time."
              </blockquote>
              <p className="text-center mt-4 font-serif">— Master Perfumer, VAVE Fragrances</p>
            </div>

            <h2>Quality Assurance</h2>
            <p>
              Quality is never compromised at VAVE. Every bottle that leaves our facility has undergone extensive
              testing to ensure it meets our exacting standards. From the concentration of the fragrance oil to the
              clarity of the liquid, every detail is scrutinized.
            </p>

            <ul>
              <li>
                <strong>Batch Testing</strong> - Every batch is tested for consistency and quality
              </li>
              <li>
                <strong>Stability Testing</strong> - Fragrances are tested under various conditions
              </li>
              <li>
                <strong>Sensory Evaluation</strong> - Expert panels evaluate each fragrance
              </li>
              <li>
                <strong>Final Inspection</strong> - Visual and olfactory inspection before packaging
              </li>
            </ul>

            <div className="text-center my-12">
              <p className="font-serif text-xl italic">
                "Craftsmanship is our commitment to creating fragrances that are not just beautiful, but unforgettable."
              </p>
            </div>
      
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
