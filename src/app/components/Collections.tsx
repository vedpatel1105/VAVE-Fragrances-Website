"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const collections = [
  {
    id: 1,
    name: "Havoc",
    price: 350,
    image: "/img/havoc50.png",
    description: "A fresh and invigorating scent with notes of citrus and ocean breeze.",
  },
  {
    id: 2,
    name: "Lavior",
    price: 350,
    image: "/img/lavior50.png",
    description: "A luxurious floral fragrance with hints of lavender and vanilla.",
  },
  {
    id: 3,
    name: "Duskfall",
    price: 350,
    image: "/img/duskfall50.png",
    description: "A mysterious and alluring scent perfect for evening wear.",
  },
  {
    id: 4,
    name: "Euphoria",
    price: 350,
    image: "/img/euphoria50.png",
    description: "An exhilarating blend of fruity and floral notes that lifts your spirits.",
  },
  {
    id: 5,
    name: "Oceane",
    price: 350,
    image: "/img/oceane50.png",
    description: "A deep, aquatic fragrance that evokes the mystery of the ocean.",
  },
]

export default function Collections() {
  return (
    <section id="collections" className="w-full py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 font-serif text-foreground"
        >
          Our Collections
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg shadow-lg group"
            >
              <Image
                src={collection.image || "/placeholder.svg"}
                alt={collection.name}
                width={600}
                height={400}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center">
                  <h3 className="text-2xl font-serif text-white mb-2">{collection.name}</h3>
                  <p className="text-sm text-white/80">{collection.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
