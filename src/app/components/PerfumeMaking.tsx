"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const steps = [
  { title: "Ingredient Selection", description: "Carefully choosing the finest natural and synthetic ingredients." },
  { title: "Formulation", description: "Blending ingredients to create a unique and balanced scent." },
  { title: "Maceration", description: "Allowing the blend to mature and develop its full character." },
  { title: "Quality Control", description: "Rigorous testing to ensure consistency and excellence." },
]

export default function PerfumeMaking() {
  return (
    <section id="perfume-making" className="w-full py-24 bg-cream dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 font-serif text-dark dark:text-cream"
        >
          The Art of Perfume Making
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src="/perfume-making.jpg"
              alt="Perfume Making Process"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
          <div>
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <h3 className="text-xl font-serif mb-2 text-gold">{step.title}</h3>
                <p className="text-dark dark:text-cream/80">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
