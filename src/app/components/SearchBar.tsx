"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality here
    console.log("Searching for:", searchTerm)
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <motion.form
        onSubmit={handleSearch}
        initial={false}
        animate={{ width: isExpanded ? "100%" : "40px" }}
        className="relative flex items-center"
      >
        <motion.input
          type="text"
          placeholder="Search perfumes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          animate={{
            width: isExpanded ? "100%" : "0%",
            padding: isExpanded ? "0.5rem 2.5rem 0.5rem 0.5rem" : "0.5rem 0",
          }}
          className="w-full bg-white dark:bg-gray-800 border border-gold rounded-full focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <motion.button
          type="submit"
          className="absolute right-0 top-0 bottom-0 bg-gold text-dark rounded-full p-2 focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Search size={20} />
        </motion.button>
      </motion.form>
      <AnimatePresence>
        {isExpanded && searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-full bg-white dark:bg-gray-800 border border-gold rounded-md shadow-lg z-10"
          >
            {/* Add search results here */}
            <p className="p-2">Search results for "{searchTerm}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
