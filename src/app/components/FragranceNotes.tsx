"use client"

import { motion } from "framer-motion"

const notes = [
  {
    name: "Top Notes",
    description: "The initial, lighter scents that are perceived immediately.",
    examples: ["Citrus", "Herbs", "Light Fruits"],
  },
  {
    name: "Heart Notes",
    description: "The main body of the fragrance, emerging after the top notes dissipate.",
    examples: ["Floral", "Spicy", "Fruity"],
  },
  {
    name: "Base Notes",
    description: "The final and longest-lasting notes that create the main theme.",
    examples: ["Woody", "Musky", "Vanilla"],
  },
]

export default function FragranceNotes() {
  return (
    <section id="fragrance-notes" className="w-full py-24 bg-background text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 font-serif"
        >
          Understanding Fragrance Notes
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {notes.map((note, index) => (
            <motion.div
              key={note.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-secondary/10 p-6 rounded-lg border border-border text-gray-800 dark:text-gray-200"
            >
              <h3 className="text-xl font-serif mb-4 text-gray-700 dark:text-gray-300">{note.name}</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">{note.description}</p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {note.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
