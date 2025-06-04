"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Havor",
    price: 350,
    image: "/perfume1.jpg",
    description: "A fresh and invigorating scent with notes of citrus and ocean breeze.",
  },
  {
    id: 2,
    name: "Lavior",
    price: 350,
    image: "/perfume2.jpg",
    description: "A luxurious floral fragrance with hints of lavender and vanilla.",
  },
  {
    id: 3,
    name: "Duskfall",
    price: 350,
    image: "/perfume3.jpg",
    description: "A mysterious and alluring scent perfect for evening wear.",
  },
  {
    id: 4,
    name: "Euphoria",
    price: 350,
    image: "/perfume4.jpg",
    description: "An exhilarating blend of fruity and floral notes that lifts your spirits.",
  },
  {
    id: 5,
    name: "Ociena",
    price: 350,
    image: "/perfume5.jpg",
    description: "A deep, aquatic fragrance that evokes the mystery of the ocean.",
  },
]

export default function FeaturedProducts() {
  return (
    <section id="featured" className="w-full py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12 font-serif">Featured Fragrances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative h-64 mb-4 overflow-hidden rounded-md">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-serif">{product.name}</h3>
                <p className="text-accent font-bold mb-2">${product.price}</p>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Notes:</span> {product.notes}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Sillage:</span> {product.sillage}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Longevity:</span> {product.longevity}
                  </p>
                </div>
              </Link>
              <button className="mt-4 w-full bg-accent text-accent-foreground py-2 rounded hover:bg-accent/90 transition-colors duration-300">
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
