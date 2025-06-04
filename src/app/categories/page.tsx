"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const categories = [
  { id: 1, name: "Floral", image: "/floral.jpg", gender: "Female" },
  { id: 2, name: "Woody", image: "/woody.jpg", gender: "Male" },
  { id: 3, name: "Oriental", image: "/oriental.jpg", gender: "Unisex" },
  { id: 4, name: "Fresh", image: "/fresh.jpg", gender: "Male" },
  { id: 5, name: "Citrus", image: "/citrus.jpg", gender: "Unisex" },
  { id: 6, name: "Gourmand", image: "/gourmand.jpg", gender: "Female" },
]

export default function Categories() {
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const renderCategorySection = (gender) => (
    <div className="mb-12">
      <h2 className="text-3xl font-serif font-bold mb-6 text-primary">{gender} Fragrances</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories
          .filter((category) => category.gender === gender)
          .map((category) => (
            <motion.div
              key={category.id}
              className="relative overflow-hidden rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredCategory(category.id)}
              onHoverEnd={() => setHoveredCategory(null)}
            >
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-64 object-cover"
              />
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCategory === category.id ? 1 : 0 }}
              >
                <Link href={`/categories/${category.id}`} className="text-white text-2xl font-serif">
                  {category.name}
                </Link>
              </motion.div>
            </motion.div>
          ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background text-primary py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-center mb-12">Perfume Categories</h1>
        {renderCategorySection("Male")}
        {renderCategorySection("Female")}
        {renderCategorySection("Unisex")}
      </div>
    </div>
  )
}
