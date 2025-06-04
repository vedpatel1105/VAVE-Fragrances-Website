"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function About() {
  return (
    <section id="about" className="w-full py-24 bg-dark text-cream">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <h2 className="text-3xl font-bold mb-4 font-serif">Our Passion for Perfume</h2>
            <p className="text-cream/90 mb-4">
              At Olyssé, we believe that a fragrance is more than just a scent—it's an expression of individuality and a
              gateway to memories.
            </p>
            <p className="text-cream/90">
              Our master perfumers craft each fragrance with the finest ingredients, creating unique and captivating
              scents that leave a lasting impression.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <div className="relative h-96">
              <Image
                src="/about-image.jpg"
                alt="Perfume crafting"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
