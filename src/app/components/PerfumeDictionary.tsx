"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"

const dictionaryTerms = [
  { term: "Accord", definition: "A balanced blend of notes that creates a new, distinct odor impression." },
  { term: "Aldehydes", definition: "Synthetic components that add a clean, soapy scent to fragrances." },
  {
    term: "Chypre",
    definition: "A family of perfumes based on a contrast between citrus, floral, and woody-mossy notes.",
  },
  {
    term: "Dry Down",
    definition: "The final and longest-lasting stage of a fragrance after it has fully dried on the skin.",
  },
  { term: "Eau de Parfum", definition: "A fragrance concentration containing 15-20% aromatic compounds." },
  {
    term: "Fougère",
    definition: "A family of fragrances that typically include lavender, coumarin, and oakmoss notes.",
  },
  {
    term: "Gourmand",
    definition: "Fragrances with edible or dessert-like scents, such as vanilla, chocolate, or caramel.",
  },
  {
    term: "Musk",
    definition: "A warm, sensual base note originally derived from animal sources, now typically synthetic.",
  },
  { term: "Olfactory", definition: "Relating to the sense of smell." },
  { term: "Sillage", definition: "The trail of scent left behind by a perfume wearer." },
]

export default function PerfumeDictionary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTerm, setSelectedTerm] = useState<(typeof dictionaryTerms)[0] | null>(null)

  const filteredTerms = dictionaryTerms.filter((item) => item.term.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <section className="py-24 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-serif">Perfume Dictionary</h2>
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-accent" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Terms</h3>
            <ul className="space-y-2">
              {filteredTerms.map((item) => (
                <li key={item.term}>
                  <button
                    className="text-left hover:text-accent transition-colors"
                    onClick={() => setSelectedTerm(item)}
                  >
                    {item.term}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Definition</h3>
            <AnimatePresence mode="wait">
              {selectedTerm ? (
                <motion.div
                  key={selectedTerm.term}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-bold mb-2">{selectedTerm.term}</h4>
                  <p>{selectedTerm.definition}</p>
                </motion.div>
              ) : (
                <p>Select a term to see its definition.</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
